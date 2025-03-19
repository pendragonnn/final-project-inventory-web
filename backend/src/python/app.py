from flask import Flask, request, jsonify
from statsmodels.tsa.statespace.sarimax import SARIMAX
from prophet import Prophet
import pandas as pd
import numpy as np
from sklearn.metrics import mean_absolute_error

app = Flask(__name__)

def clamp_iqr(predictions, y):
    q1 = np.percentile(y, 25)
    q3 = np.percentile(y, 75)
    iqr = q3 - q1
    lower_bound = max(0, q1 - 1.5 * iqr)  # Hindari negatif
    upper_bound = q3 + 1.5 * iqr
    return np.clip(predictions, lower_bound, upper_bound)

def moving_average_smoothing(predictions, window=3):
    return np.convolve(predictions, np.ones(window)/window, mode='valid')

def aggregate_daily_data(X_dates, y):
    df = pd.DataFrame({'ds': pd.to_datetime(X_dates), 'y': y})
    df = df.groupby('ds', as_index=False).sum()  # Aggregasi per tanggal
    return df['ds'].dt.date.astype(str).tolist(), df['y'].tolist()

def fill_missing_dates(X_dates, y):
    df = pd.DataFrame({'ds': pd.to_datetime(X_dates), 'y': y})
    
    if df.empty or df['ds'].isna().all():  # Cek jika dataset kosong atau semua tanggal NaT
        return [], []

    min_date, max_date = df['ds'].min(), df['ds'].max()
    
    if pd.isna(min_date) or pd.isna(max_date):  # Cek jika tanggal masih NaT
        return [], []

    date_range = pd.date_range(start=min_date, end=max_date, freq='D')
    df = df.set_index('ds').reindex(date_range).fillna(0).reset_index()
    df.columns = ['ds', 'y']
    
    return df['ds'].dt.date.astype(str).tolist(), df['y'].tolist()


def adjust_predictions(predictions, average_sales, period):
    if len(predictions) < period:
        # Isi prediksi yang kurang dengan rata-rata harian
        predictions = np.append(predictions, [average_sales] * (period - len(predictions)))
    return predictions

def train_sarima(X_dates, y, period):
    df = pd.DataFrame({'ds': pd.to_datetime(X_dates), 'y': y})
    df.set_index('ds', inplace=True)
    
    model = SARIMAX(df['y'], order=(1,1,1), seasonal_order=(1,1,1,7))
    fitted_model = model.fit(disp=False)
    
    forecast = fitted_model.get_forecast(steps=period)
    pred_mean = forecast.predicted_mean
    conf_int = forecast.conf_int()
    
    return pred_mean.tolist(), conf_int

def train_prophet(X_dates, y, period):
    df = pd.DataFrame({'ds': pd.to_datetime(X_dates), 'y': y})  # Gunakan data asli

    model = Prophet(
        seasonality_mode='additive',
        growth='flat',
        changepoint_prior_scale=0.01  # Kurangi sensitivitas
    )
    model.add_seasonality(name='weekly', period=7, fourier_order=3)
    model.add_seasonality(name='monthly', period=30.5, fourier_order=5)

    df['day'] = df['ds'].dt.day
    df['is_weekend'] = (df['ds'].dt.weekday >= 5).astype(int)
    df['is_25_26'] = df['day'].isin([25, 26]).astype(int)
    df['is_double_date'] = (df['day'] == df['ds'].dt.month).astype(int)
    df['is_25_31'] = df['day'].isin(range(25, 32)).astype(int)

    for col in ['is_weekend', 'is_25_26', 'is_double_date', 'is_25_31']:
        model.add_regressor(col)

    model.fit(df)

    future = model.make_future_dataframe(periods=period)
    future['day'] = future['ds'].dt.day
    future['is_weekend'] = (future['ds'].dt.weekday >= 5).astype(int)
    future['is_25_26'] = future['day'].isin([25, 26]).astype(int)
    future['is_double_date'] = (future['day'] == future['ds'].dt.month).astype(int)
    future['is_25_31'] = future['day'].isin(range(25, 32)).astype(int)

    forecast = model.predict(future)
    pred = forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].tail(period)

    # Pastikan yhat_lower dan yhat_upper tidak negatif
    pred['yhat_lower'] = np.maximum(0, pred['yhat_lower'])
    pred['yhat_upper'] = np.maximum(0, pred['yhat_upper'])

    return pred['yhat'].tolist(), (pred['yhat_lower'].tolist(), pred['yhat_upper'].tolist())

def calculate_confidence(y_true, y_pred, intervals, error_margin):
    # Cek berapa banyak prediksi yang berada dalam interval dengan margin kesalahan
    within_interval_count = sum(
        1 for true, pred, lower, upper in zip(y_true, y_pred, intervals[0], intervals[1])
        if lower - error_margin <= pred <= upper + error_margin
    )
    
    # Persentase prediksi yang berada dalam interval
    confidence = within_interval_count / len(y_true)
    
    # Jika confidence lebih kecil dari 0.5, set minimum ke 0.5
    return  confidence


@app.route('/predict', methods=['POST'])
def predict_sales():
    data = request.get_json()
    item_id = data.get('itemId', 'unknown')
    X_dates = pd.to_datetime(data['X'])
    y = np.array(data['y'])
    period = data.get('period', 7)
    current_stock = data.get('currentStock', 0)
  

    # Aggregasi dan isi tanggal yang hilang
    X_dates, y = aggregate_daily_data(X_dates, y)
    X_dates, y = fill_missing_dates(X_dates, y)

    if len(y) < 2 or np.count_nonzero(y) < 2:  # Pastikan minimal 2 transaksi
        return jsonify({
            "error": "Not enough transactions for forecasting."
        }), 400

    print("X_dates (aggregated):", X_dates)
    print("y (aggregated):", y)
    print("period:", period)
    print("current_stock:", current_stock)
    print("total_transaction:", sum(y))
    print("total_day:", len(y))

    model_type = data.get('model', 'sarima')

    if model_type == 'prophet':
        predictions, intervals = train_prophet(X_dates, y, period)
    else:
        predictions, intervals = train_sarima(X_dates, y, period)

    # Clamp dengan IQR
    predictions = clamp_iqr(predictions, y)

    # Smooth prediksi harian
    smoothed_predictions = moving_average_smoothing(predictions)

    # Sesuaikan prediksi jika kurang dari period
    average_sales = np.mean(y)
    smoothed_predictions = adjust_predictions(smoothed_predictions, average_sales, period)

    predicted_sales = sum(smoothed_predictions)
    stock_needed = max(0, predicted_sales - current_stock)

    # Calculate confidence dynamically
    error_margin = mean_absolute_error(y, predictions[:len(y)]) if len(predictions) >= len(y) else 0
    confidence = calculate_confidence(y, predictions[:len(y)], intervals, error_margin)


    # Error margin dihitung berdasarkan panjang data yang valid
    min_len = min(len(y), len(predictions))

    # Calculate prediction interval
    prediction_interval = np.std(predictions) * 1.96  # 95% confidence interval

    response = {
        "itemId": item_id,
        "forecast": {
            "average": f"{average_sales:.2f}",
            "predictedSales": f"{predicted_sales:.2f}",
            "predictedSalesDaily": [f"{p:.2f}" for p in smoothed_predictions],
            "stockNeeded": stock_needed,
            "currentStock": current_stock,
            "confidence": f"{confidence * 100:.4f}",
            "errorMargin": f"{error_margin:.4f}",
            "predictionInterval": f"{prediction_interval:.4f}",
            "message": f"Forecast based on {model_type.upper()} with IQR clamping & smoothing"
        }
    }

    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True)

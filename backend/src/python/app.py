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
    
    if df.empty or df['ds'].isna().all():
        return [], []

    min_date, max_date = df['ds'].min(), df['ds'].max()
    
    if pd.isna(min_date) or pd.isna(max_date):
        return [], []

    date_range = pd.date_range(start=min_date, end=max_date, freq='D')
    df = df.set_index('ds').reindex(date_range).fillna(0).reset_index()
    df.columns = ['ds', 'y']
    
    return df['ds'].dt.date.astype(str).tolist(), df['y'].tolist()

def adjust_predictions(predictions, average_sales, period):
    if len(predictions) < period:
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
    df = pd.DataFrame({'ds': pd.to_datetime(X_dates), 'y': y})

    model = Prophet(
        seasonality_mode='multiplicative',
        growth='flat',
        changepoint_prior_scale=0.1,
        seasonality_prior_scale=15.0,
        daily_seasonality=False
    )
    
    # 1. Pisahkan fitur Sabtu dan Minggu
    df['is_saturday'] = (df['ds'].dt.weekday == 5).astype(int)
    df['is_sunday'] = (df['ds'].dt.weekday == 6).astype(int)
    
    # 2. Tambahkan regressor khusus hari
    df['saturday_boost'] = df['is_saturday'] * 1.3  # Boost 50% untuk Sabtu
    df['sunday_boost'] = df['is_sunday'] * 1.3       # Boost 30% untuk Minggu
    
    # 3. Fitur tambahan
    df['day'] = df['ds'].dt.day
    df['is_25_31'] = df['day'].isin(range(25, 32)).astype(int)
    df['is_double_date'] = (df['day'] == df['ds'].dt.month).astype(int)
    
    # 4. Interaksi khusus weekend
    df['saturday_25_31'] = (df['is_saturday'] & df['is_25_31']).astype(int)
    df['sunday_special'] = (df['is_sunday'] & (df['day'] == 1)).astype(int)  # Contoh interaksi khusus
    
    regressors = [
        'is_saturday',
        'is_sunday',
        'saturday_boost',
        'sunday_boost',
        'is_25_31',
        'is_double_date',
        'saturday_25_31',
        'sunday_special'
    ]
    
    for reg in regressors:
        model.add_regressor(reg)

    model.fit(df)

    # Persiapkan future dataframe
    future = model.make_future_dataframe(periods=period)
    future['day'] = future['ds'].dt.day
    future['is_saturday'] = (future['ds'].dt.weekday == 5).astype(int)
    future['is_sunday'] = (future['ds'].dt.weekday == 6).astype(int)
    future['saturday_boost'] = future['is_saturday'] * 1.5
    future['sunday_boost'] = future['is_sunday'] * 1.3
    future['is_25_31'] = future['day'].isin(range(25, 32)).astype(int)
    future['is_double_date'] = (future['day'] == future['ds'].dt.month).astype(int)
    future['saturday_25_31'] = (future['is_saturday'] & future['is_25_31']).astype(int)
    future['sunday_special'] = (future['is_sunday'] & (future['day'] == 1)).astype(int)

    forecast = model.predict(future)
    
    # Post-processing khusus
    pred = forecast.tail(period)
    predictions = pred['yhat'].values
    
    # Dapatkan hari untuk prediksi
    pred_dates = future.tail(period)['ds'].dt.weekday
    
    # Atur hubungan Sabtu-Minggu
    for i in range(1, len(predictions)):
        # Jika hari ini Minggu dan kemarin Sabtu
        if pred_dates.iloc[i] == 6 and pred_dates.iloc[i-1] == 5:
            # Pastikan prediksi Minggu minimal 80% dari Sabtu
            min_sunday = predictions[i-1] * 0.8
            predictions[i] = max(predictions[i], min_sunday)
            
            # Jika Sabtu > 20 transaksi, Minggu minimal 60%
            if predictions[i-1] > 20:
                predictions[i] = max(predictions[i], predictions[i-1] * 0.6)
    
    return predictions.tolist(), (pred['yhat_lower'].tolist(), pred['yhat_upper'].tolist())

def calculate_confidence(y_true, y_pred, intervals, error_margin):
    within_interval_count = sum(
        1 for true, pred, lower, upper in zip(y_true, y_pred, intervals[0], intervals[1])
        if lower - error_margin <= pred <= upper + error_margin
    )
    confidence = within_interval_count / len(y_true)
    return max(0.5, confidence)  # Minimum confidence 50%

@app.route('/predict', methods=['POST'])
def predict_sales():
    data = request.get_json()
    item_id = data.get('itemId', 'unknown')
    X_dates = pd.to_datetime(data['X'])
    y = np.array(data['y'])
    period = data.get('period', 7)
    current_stock = data.get('currentStock', 0)


    X_dates, y = aggregate_daily_data(X_dates, y)
    X_dates, y = fill_missing_dates(X_dates, y)
    print("X_dates (aggregated):", X_dates)
    print("y (aggregated):", y)
    print("period:", period)
    print("current_stock:", current_stock)
    print("total_transaction:", sum(y))
    print("total_day:", len(y))

    if len(y) < 2 or np.count_nonzero(y) < 2:
        return jsonify({
            "error": "Not enough transactions for forecasting."
        }), 400

    model_type = data.get('model', 'prophet')  # Default ke Prophet sekarang

    if model_type == 'prophet':
        predictions, intervals = train_prophet(X_dates, y, period)
    else:
        predictions, intervals = train_sarima(X_dates, y, period)

    predictions = clamp_iqr(predictions, y)
    smoothed_predictions = moving_average_smoothing(predictions)
    average_sales = np.mean(y)
    smoothed_predictions = adjust_predictions(smoothed_predictions, average_sales, period)

    predicted_sales = sum(smoothed_predictions)
    stock_needed = max(0, predicted_sales - current_stock)

    error_margin = mean_absolute_error(y, predictions[:len(y)]) if len(predictions) >= len(y) else 0
    confidence = calculate_confidence(y, predictions[:len(y)], intervals, error_margin)

    prediction_interval = np.std(predictions) * 1.96

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
            "message": f"Forecast based on {model_type.upper()} with weekend optimization"
        }
    }

    return jsonify(response)

if __name__ == '__main__':
    # Jalankan hanya jika ini adalah proses utama, bukan reloader
    import os
    if os.environ.get("WERKZEUG_RUN_MAIN") == "true":
        print("Flask running (actual execution)")
    app.run(debug=True)
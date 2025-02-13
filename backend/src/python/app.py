from flask import Flask, request, jsonify
from sklearn.linear_model import LinearRegression
import numpy as np
import pandas as pd

app = Flask(__name__)

@app.route('/predict', methods=['POST'])
def predict_sales():
    # Menerima data X dan y dari request
    data = request.get_json()
    X = np.array(data['X']).reshape(-1, 1)  # Fitur (misalnya tanggal)
    y = np.array(data['y'])  # Target (jumlah barang yang keluar)

    # Membuat model regresi linier
    model = LinearRegression()

    # Melatih model dengan data yang diberikan
    model.fit(X, y)

    # Prediksi penjualan untuk periode ke depan (misalnya 7 hari)
    predicted_sales = model.predict(X[-1].reshape(-1, 1))  # Prediksi untuk data berikutnya (hari setelah data terakhir)

    return jsonify({
        'predicted_sales': predicted_sales.tolist()
    })

if __name__ == '__main__':
    app.run(debug=True)

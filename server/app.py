import os
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import requests

load_dotenv()

app = Flask(__name__)
# React(ポート5173等)からFlask(ポート5000)へのアクセスを許可する
CORS(app)



# GAS URL
GAS_URL = "https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLgEsz5ybjWjeSbuKn83j_ky-vRxVjUTNxrkiU5q6aYijIEKIZA_tQkdIkQzwuVqvcNGIaBBdNUArG-Td2rX1tMAo_lKViF-VDwpP3Wsa52yKmR4lHhRCdh8j8pDLSB2V8BJKtH6j0jpXsywas6XJFs8TaH0Vn1G1dlM_I407jbHuYTQ3PZ3dGBjciI_J0VNcLK817EO7-V3qygsUoun0f4XSZkDwaKdUGI-LVK5QwajE0nhQSc1E_Sr4Kpz7oxJwnSuXGy9-vgreJ9_RAoZXoF4_pK8Qe5KzMMVtO4w&lib=MDUFyeJDjWL4JFu1sJhyBNy15I613relY" 

@app.route('/api/status')
def get_status():
    try:
        # GASからデータを取得
        response = requests.get(GAS_URL)
        data = response.json()
        
        # もしGAS側で空き時間の処理が甘くても、ここで安全策をとる
        if not data:
            return jsonify({"status": "free", "start_time": None, "end_time": None})
            
        return jsonify(data)
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"status": "error"})

@app.route('/api/weather', methods=['GET'])
def get_weather():
    # .env からURLとAPIキーを安全に取得
    api_key = os.getenv("OPENWEATHER_API_KEY")
    base_url = os.getenv("OPENWEATHER_BASE_URL")
    
    # URLにくっつけるパラメータ（京都の指定など）
    params = {
        "q": "Kyoto,jp",
        "units": "metric",
        "lang": "ja",
        "appid": api_key
    }
    
    try:
        # Flaskが身代わりになってOpenWeatherにリクエストを送る
        response = requests.get(base_url, params=params)
        response.raise_for_status() # エラーがあれば例外を投げる
        
        # 取得した天気データをそのままReactに返す
        return jsonify(response.json())
        
    except requests.exceptions.RequestException as e:
        print("Weather API Error:", e)
        return jsonify({"error": "天気の取得に失敗しました"}), 500

if __name__ == '__main__':
    # 開発用サーバー起動
    app.run(host='0.0.0.0', port=5000, debug=True)
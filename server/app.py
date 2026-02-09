from flask import Flask, jsonify
from flask_cors import CORS
import requests

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

if __name__ == '__main__':
    # 開発用サーバー起動
    app.run(host='0.0.0.0', port=5000, debug=True)
#app.pyでは２つのプログラムを同時に動かしている．
#Flaskサーバ：React（ブラウザ）からの要求を待っており，要求があればデータを送信する．
#ボタン監視スレッド：Flaskとは無関係にボタン入力の有無を監視し，押されたら変数を書き換える．
import os

#Flaskサーバ用
from flask import Flask, jsonify
from flask_cors import CORS
import requests

#Flaskとボタン監視の両立用にスレッドを使う．
#スレッド：分身．メインでFlaskサーバ，分身でボタン監視を同時に行う．
#スレッドがない場合．．．(1)ボタン監視を先に動かすと，監視ループを抜け出せない．
#                    (2)Flaskサーバを先に動かすとリクエスト待ちから抜け出せない（ボタン入力が反映されない）．
import threading 
import time

#ラズパイ環境用 (Windows等でのエラー防止)
#RPi.GPIOはラズベリーパイ専用ライブラリ．ラズパイでコードを実行するとインポートに成功してHAS_GPIOがT．
#PC（Windows）でコードを実行するとインポートに失敗でHAS_GPIOがF．失敗するだけでエラーにはならないようにしている．
try:
    import RPi.GPIO as GPIO
    HAS_GPIO = True
except ImportError:
    HAS_GPIO = False

app = Flask(__name__)
CORS(app)

GAS_URL = "https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLgEsz5ybjWjeSbuKn83j_ky-vRxVjUTNxrkiU5q6aYijIEKIZA_tQkdIkQzwuVqvcNGIaBBdNUArG-Td2rX1tMAo_lKViF-VDwpP3Wsa52yKmR4lHhRCdh8j8pDLSB2V8BJKtH6j0jpXsywas6XJFs8TaH0Vn1G1dlM_I407jbHuYTQ3PZ3dGBjciI_J0VNcLK817EO7-V3qygsUoun0f4XSZkDwaKdUGI-LVK5QwajE0nhQSc1E_Sr4Kpz7oxJwnSuXGy9-vgreJ9_RAoZXoF4_pK8Qe5KzMMVtO4w&lib=MDUFyeJDjWL4JFu1sJhyBNy15I613relY"

# 状態管理用変数
current_mode = 0
last_button_time = None
OVERRIDE_DURATION = 600  # 10分間

#ボタン入力を常に監視用
#★ラズベリーパイでコードを実行している時（HAS_GPIOがTの時）だけ必要な処理★
def watch_buttons():
    global current_mode, last_button_time #今のモードを示す変数，ボタンを押してからの経過秒数
    #HAS_GPIOがFならこの関数では何もしない．
    if not HAS_GPIO: return

    PIN_IN_USE = 23    # ①急遽使用中
    PIN_AWAY = 24      # ②急遽不在中
    PIN_RESET = 25     # ③リセット（通常に戻る） 

    #ピンの定義とプルアップ（ボタンが押されてない時をH，押されている時をLとしている）
    GPIO.setmode(GPIO.BCM)
    GPIO.setup(PIN_IN_USE, GPIO.IN, pull_up_down=GPIO.PUD_UP) #緊急使用
    GPIO.setup(PIN_AWAY, GPIO.IN, pull_up_down=GPIO.PUD_UP) #緊急退席
    GPIO.setup(PIN_RESET, GPIO.IN, pull_up_down=GPIO.PUD_UP) # リセット機能

    while True:
        # ボタン23: 急遽使用中
        if GPIO.input(PIN_IN_USE) == GPIO.LOW:  #LOW：23Pinのボタンが押されている時
            current_mode = 1
            last_button_time = time.time() #23ピンが押された瞬間の時間（正確には経過時間）を記録
            print("Button 23: Mode set to Emergency In-Use")
            time.sleep(0.5)
                         # すでに割り込み中(current_mode != 0)なら、時刻を更新しないver
                         #if current_mode == 0:
                         #    last_button_time = time.time()
                         #current_mode = 1
                         #print("Button 23 pressed")
                         #time.sleep(0.5)

        # ボタン24: 急遽不在中
        elif GPIO.input(PIN_AWAY) == GPIO.LOW:
            current_mode = 2
            last_button_time = time.time()
            print("Button 24: Mode set to Emergency Away")
            time.sleep(0.5)
            
        # ボタン25: 緊急モードリセット 
        elif GPIO.input(PIN_RESET) == GPIO.LOW:
            #25ピンが押されるとモードを0して，ボタンを押された時の時間の記録も消去（これにより次からはカレンダー表示になる）
            current_mode = 0
            last_button_time = None
            print("Button 25: Reset to Normal Mode")
            time.sleep(0.5)

        time.sleep(0.1)

if HAS_GPIO:
    #新しいスレッド（分身）を作って、watch_buttons（ボタン監視）という仕事を割り当てる
    #daemon=Tで，メイン（Flaskサーバ）が終了したらスレッド（ボタン監視）も一緒に終了．ボタン監視のゾンビ化防止．
    thread = threading.Thread(target=watch_buttons, daemon=True)
    #メインの処理とは別のラインで今すぐ実行スタート．
    thread.start()

#直下のget status関数を「React（ブラウザ）からの要求に答える窓口」に変化させている．
#/api/statusはFlaskサーバ内のアクセスすべきパス．これがないとReact側はサーバ内のどのプログラムが必要か分からない．
#Reactが「http://～～/api/status」にアクセスした場合，Flaskサーバはリクエストだとみなしてget status関数を起動．
@app.route('/api/status')
def get_status():             #React側から現在のカレンダー情報をリクエストされるたびに実行される．
    global current_mode, last_button_time
    
    # 10分経過チェック (current_modeが0でない時のみ判定)
    #緊急モードの場合は，elapsedにボタンが押されてからの経過時間を格納．
    if current_mode != 0 and last_button_time is not None: 
        elapsed = time.time() - last_button_time
        #もし最後にボタンが押されてから10分経っていれば通常モード0に戻す．
        if elapsed > OVERRIDE_DURATION:
            current_mode = 0
            last_button_time = None
   
    #Googleカレンダーの情報を持つ「GAS」にアクセスし，最新予定（ステータス，開始時刻，終了時刻）をダウンロード．
    try:
        # GASから最新データを取得
        response = requests.get(GAS_URL)
        data = response.json() #インターネット上のデータをPythonで扱いやすいjson形式に変換（React側が理解可能な形式）．
        
        # ★緊急モード（1 or 2）ならGASの結果「data」を破棄して，緊急用のデータに上書き．
        if current_mode == 1:
            data = {"status": "emergency_in_use", "start_time": "Now", "end_time": "10min"}
        elif current_mode == 2:
            data = {"status": "emergency_away", "start_time": "Now", "end_time": "10min"}
        # current_mode == 0 の場合は、上書きせずにそのままGASの「data」を返す
            
        return jsonify(data)
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"status": "error"}) #React側に送る専用のエラーメッセージ

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

#おまじない．python app.pyと打ち込んだ時だけpaa.runが実行される．
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False) 
    #0.0.0.0によってlocalhost以外からのアクセス（起動命令）も受付．
    #ポート：5000．React側の宛先と同一．
    #debug：スレッドを使う場合はF（スレッドが二重に起動してバグる可能性があるらしい．）

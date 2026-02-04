## Webページ表示方法
```
cd client
npm install
npm run dev
```

## 依存環境メモ
※初期セットアップメモ
- Backend側
```
pip install flask flask-cors requests
```
- Front側
```
npm create vite@latest client -- --template react
```

## 自分用メモ
- Flaskとは？
  PythonのWebアプリケーションフレームワーク
  - `@app.route('')`とは
    - ''内のURLへのアクセスを関数実行のトリガーにする
    - つまり，React側でこのURL（今回だと/api/status）を叩くと，関数が動いてGASからデータを取ってくる仕組み

import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [data, setData] = useState({ status: "loading", start_time: null });
  const [currentTime, setCurrentTime] = useState(new Date());

  // 1. 時計の更新 (毎秒)
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 2. GASデータの取得 (5秒おき)
  const fetchStatus = async () => {
    try {
      // Flaskサーバーへ問い合わせ
      const res = await fetch("http://localhost:5000/api/status");
      const json = await res.json();
      console.log("Fetched:", json);
      setData(json);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    fetchStatus(); // 初回実行
    const interval = setInterval(fetchStatus, 5000); // 5秒ごとに更新
    return () => clearInterval(interval);
  }, []);

  // --- 表示内容の決定 ---
  const formatTime = (date) =>
    date.toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" });

  // ステータスに応じた表示テキストとクラス名
  let displayStatus = "";
  let statusClass = "";

  // GASのstatus値に合わせて分岐
  switch (data.status) {
    case "experiment":
      displayStatus = "EXPERIMENT";
      statusClass = "status-experiment";
      break;
    case "meeting":
      displayStatus = "MEETING";
      statusClass = "status-meeting";
      break;
    case "seminar":
      displayStatus = "SEMINAR";
      statusClass = "status-seminar";
      break;
    case "free":
      displayStatus = "OPEN";
      statusClass = "status-free";
      break;
    default:
      displayStatus = data.status || "LOADING...";
      statusClass = "status-loading";
  }

  return (
    <div className={`container ${statusClass}`}>
      {/* 背景のエフェクト（オプション） */}
      <div className="overlay"></div>

      <div className="content">
        <h1 className="main-text">{displayStatus}</h1>

        <div className="sub-info">
          <p className="clock">{formatTime(currentTime)}</p>
          {data.start_time && data.start_time !== "none" && (
            <p className="schedule-time">
              Plan: {data.start_time} - {data.end_time}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

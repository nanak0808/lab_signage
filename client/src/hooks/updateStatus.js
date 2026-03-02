import { useState, useEffect, use } from "react";
import { fetchGasStatus } from "../services/api";

export const updateStatus = () => {
  const [data, setData] = useState({
    status: "loading",
    start_time: null,
    end_time: null,
  });
  const [currentTime, setCurrentTime] = useState(new Date());

  // 時計の更新 (毎秒)
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // GASデータの取得 (5秒おき)
  useEffect(() => {
    const loadData = async () => {
      const json = await fetchGasStatus();
      setData(json);
    };
    loadData(); // 初回実行
    const interval = setInterval(loadData, 5000); // 5秒ごとに更新
    return () => clearInterval(interval);
  }, []);

  return { data, currentTime };
};

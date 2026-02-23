import { useState, useEffect } from "react";
import styled from "@emotion/styled";

const WeatherContainer = styled.div`
  position: absolute;
  top: 80px;
  left: 80px; /* 時計の反対側（左上）に配置する例 */
  color: white;
  z-index: 100;
  text-align: left;
  /* ドット絵フォントに合わせる */
  font-family: var(--main-font);
`;

const Temp = styled.p`
  font-size: 3vw;
  font-weight: bold;
  margin: 0;
`;

const Desc = styled.p`
  font-size: 1.5vw;
  margin: 0;
  opacity: 0.8;
`;

function Weather() {
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    // 天気を取得する関数
    const fetchWeather = async () => {
      try {
        const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
        // 例として京都(Kyoto,jp)を指定。units=metricで摂氏(℃)、lang=jaで日本語化
        const url = `https://api.openweathermap.org/data/2.5/weather?q=Kyoto,jp&units=metric&lang=ja&appid=${apiKey}`;

        const response = await fetch(url);
        if (!response.ok) throw new Error("天気の取得に失敗しました");

        const data = await response.json();
        setWeatherData(data);
      } catch (error) {
        console.error("Weather API Error:", error);
      }
    };

    // 初回マウント時に実行
    fetchWeather();

    // サイネージ用：1時間（3600000ミリ秒）ごとに天気を自動更新
    // ※OpenWeatherの無料枠は1日1000回までなので、頻繁な更新(毎秒など)はNG！
    const intervalId = setInterval(fetchWeather, 1000 * 60 * 60);

    return () => clearInterval(intervalId);
  }, []);

  // データ取得前は何も表示しない（またはLoadingなどを出す）
  if (!weatherData) return null;

  return (
    <WeatherContainer>
      {/* weatherData.weather[0].description で「晴れ」「曇りがち」などの日本語が入ります */}
      <Desc>{weatherData.weather[0].description}</Desc>
      {/* Math.roundで小数点を四捨五入して見やすくする */}
      <Temp>{Math.round(weatherData.main.temp)}°C</Temp>
    </WeatherContainer>
  );
}

export default Weather;

import { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { fetchWeather } from "../services/api.js";
import sunnyIcon from "../images/weather_sunny.svg";
import cloudyIcon from "../images/weather_cloudy_white.svg";
import rainyIcon from "../images/weather_rain_umbrella_light.svg";
import snowyIcon from "../images/weather_snow_heavy.svg";

const HeaderContainer = styled.div`
  position: absolute;
  top: 70px;
  left: 90px;
  display: flex;
  align-items: center;
  gap: 20px;
  z-index: 100;
`;

const WeatherImage = styled.img`
  width: 4vw;
  height: auto;
  margin: 0;
`;

const StyledTemp = styled.p`
  font-size: 4vw;
  font-weight: bold;
  color: #ffffff;
  opacity: 0.8;
  margin: 0;
`;

function Weather() {
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    const getAndSetWeather = () => {
      fetchWeather()
        .then((data) => {
          console.log("現在の天気データ:", data.weather[0].main);
          setWeatherData(data);
        })
        .catch((error) =>
          console.error("Failed to fetch weather data:", error),
        );
    };

    // 初回実行
    getAndSetWeather();

    // 1時間ごとの定期実行（作った関数を呼ぶ）
    const intervalId = setInterval(getAndSetWeather, 1000 * 60 * 60);

    return () => clearInterval(intervalId);
  }, []);

  if (!weatherData) return null;

  const mainWeather = weatherData.weather[0].main;

  return (
    <HeaderContainer>
      {mainWeather === "Clear" && <WeatherImage src={sunnyIcon} alt="晴れ" />}
      {mainWeather === "Clouds" && <WeatherImage src={cloudyIcon} alt="曇り" />}
      {mainWeather === "Rain" && <WeatherImage src={rainyIcon} alt="雨" />}
      {mainWeather === "Snow" && <WeatherImage src={snowyIcon} alt="雪" />}
      <StyledTemp>{Math.round(weatherData.main.temp)}°C</StyledTemp>
    </HeaderContainer>
  );
}

export default Weather;

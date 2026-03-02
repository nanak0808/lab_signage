const GAS_API_URL = "http://localhost:5000/api/status";
const WEATHER_API_URL = "http://localhost:5000/api/weather";

export const fetchGasStatus = async () => {
  try {
    const response = await fetch(GAS_API_URL);
    if (!response.ok)
      throw new Error(
        `Googleカレンダー情報の取得に失敗しました(status: ${response.status})`,
      );
    return await response.json();
  } catch (error) {
    console.error("Error fetching status:", error);
    return { status: "error", start_time: "none", end_time: "none" };
  }
};

export const fetchWeather = async () => {
  try {
    const response = await fetch(WEATHER_API_URL);
    if (!response.ok)
      throw new Error(`天気の取得に失敗しました(status: ${response.status})`);
    return await response.json();
  } catch (error) {
    console.error("Weather API Error:", error);
    throw error;
  }
};

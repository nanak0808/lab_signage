const GAS_API_URL = "http://localhost:5000/api/status";

export const fetchGasStatus = async () => {
  try {
    const response = await fetch(GAS_API_URL);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching status:", error);
    return { status: "error", start_time: "none", end_time: "none" };
  }
};

export const fetchWeather = async () => {
  try {
    const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=Kyoto,jp&units=metric&lang=ja&appid=${apiKey}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error("天気の取得に失敗しました");

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Weather API Error:", error);
    throw error;
  }
};

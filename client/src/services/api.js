const API_URL = "http://localhost:5000/api/status";

export const fetchGasStatus = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching status:", error);
    return { status: "error", start_time: "none", end_time: "none" };
  }
};

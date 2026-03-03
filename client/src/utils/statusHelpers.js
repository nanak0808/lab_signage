export const getStatusInfo = (status) => {
  switch (status) {
    case "experiment":
      return {
        text: "使用中",
        category: "実験",
        className: "status-experiment",
      };
    case "meeting":
      return { text: "使用中", category: "会議", className: "status-meeting" };
    case "seminar":
      return {
        text: "使用中",
        category: "ゼミ",
        className: "status-seminar",
      };
    case "emergency_in_use":
      return {
        text: "使用中",
        category: "emergency_in_use",
        className: "status-emergency-in-use",
      };
    case "emergency_away":
      return {
        text: "不在中",
        category: "emergency_away",
        className: "status-emergency-away",
      };
    case "free":
      return { text: "空き", category: null, className: "status-free" };
    default:
      return {
        text: status || "LOADING...",
        category: null,
        className: "status-loading",
      };
  }
};

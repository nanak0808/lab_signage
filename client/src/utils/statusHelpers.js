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

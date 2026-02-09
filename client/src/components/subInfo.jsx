import "../css/subInfo.css";

const formatTime = (date) =>
  date.toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" });

function SubInfo({ currentTime, data }) {
  return (
    <div className="sub-info">
      <p className="clock">{formatTime(currentTime)}</p>
      {data.start_time && data.start_time !== "none" && (
        <p className="schedule-time">
          Plan: {data.start_time} - {data.end_time}
        </p>
      )}
    </div>
  );
}

export default SubInfo;

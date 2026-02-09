import "../css/mainText.css";

function MainText({ displayStatus }) {
  return (
    <div>
      <h1 className="main-text">{displayStatus}</h1>
    </div>
  );
}

export default MainText;

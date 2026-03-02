import styled from "@emotion/styled";
import Weather from "./weather.jsx";

const StyledClock = styled.p`
  position: absolute;
  top: 70px;
  right: 90px;
  font-size: 4vw;
  font-weight: bold;
  color: #ffffff;
  opacity: 0.8;
  margin: 0;
  z-index: 100;
`;

const formatTime = (date) =>
  date.toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" });

function Header({ currentTime }) {
  return (
    <div>
      <StyledClock>{formatTime(currentTime)}</StyledClock>
      <Weather />
    </div>
  );
}

export default Header;

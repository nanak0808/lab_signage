import styled from "@emotion/styled";

const StyledClock = styled.p`
  font-size: 3vw;
  font-weight: bold;
  color: #ffffff;
  opacity: 0.8;
`;

const formatTime = (date) =>
  date.toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" });

function Header({ currentTime }) {
  return (
    <div>
      <StyledClock>{formatTime(currentTime)}</StyledClock>
    </div>
  );
}

export default Header;

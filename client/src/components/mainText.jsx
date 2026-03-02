import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";

const pulseRed = keyframes`
  0% {text-shadow: 0 0 20px #ff3333; opacity: 1;}
  50% {text-shadow: 0 0 50px #ff0000; opacity: 0.8;}
  100% {text-shadow: 0 0 20px #ff3333; opacity: 1;}
`;

const StyledMainText = styled.h1`
  font-size: 17vw;
  font-weight: 900;
  margin: 0;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  transition: all 0.5s ease;
  text-shadow: 0 0 20px currentColor;

  ${(props) => {
    switch (props.status) {
      case "experiment":
        return `
        color: #ff3333;
        animation: ${pulseRed} 2s infinite;
        `;
      case "meeting":
        return `color: #00ccff;`;
      case "seminar":
        return `color: #ffaa00;`;
      case "free":
        return `color: #33ff33;`;
      case "emergency_in_use":
        return `color: #ff0000;`;
      case "emergency_away":
        return `color: #ff0000;`;
      default:
        return `color: #ffffff;`;
    }
  }};
`;

function MainText({ displayStatus, status }) {
  return (
    <div>
      <StyledMainText status={status}>{displayStatus}</StyledMainText>
    </div>
  );
}

export default MainText;

import styled from "@emotion/styled";
import MainText from "./components/mainText.jsx";
import SubInfo from "./components/subInfo.jsx";
import Header from "./components/header.jsx";
import { updateStatus } from "./hooks/updateStatus.js";
import { getStatusInfo } from "./utils/statusHelpers.js";

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  transition: background-color 0.5s ease; /* 背景色の変化をヌルっとさせる */

  background-color: ${(props) => {
    switch (props.status) {
      case "experiment":
        return "radial-gradient(circle, #330000 0%, #000000 90%)";
      case "meeting":
        return "radial-gradient(circle, #001133 0%, #000000 90%)";
      case "seminar":
        return "radial-gradient(circle, #331a00 0%, #000000 90%)";
      case "free":
        return "radial-gradient(circle, #003300 0%, #000000 90%)";
      default:
        return "#111"; // loading/error
    }
  }};
`;

const Content = styled.div`
  z-index: 10;
  text-align: center;
`;

function App() {
  const { data, currentTime } = updateStatus();
  const { text, category, className } = getStatusInfo(data.status);

  return (
    <Container status={data.status}>
      <Content className={className}>
        <Header currentTime={currentTime} />
        <MainText displayStatus={text} status={data.status} />
        <SubInfo data={data} category={category} />
      </Content>
    </Container>
  );
}

export default App;

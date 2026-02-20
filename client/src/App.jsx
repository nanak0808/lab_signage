import styled from "@emotion/styled";
import MainText from "./components/mainText.jsx";
import SubInfo from "./components/subInfo.jsx";
import Header from "./components/header.jsx";
import { updateStatus } from "./hooks/updateStatus.js";
import { getStatusInfo } from "./utils/statusHelpers.js";
import characterGif from "../public/gifs/wink.gif";

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  transition: background 0.5s ease; /* 背景色の変化をヌルっとさせる */
  position: relative; /* absoluteの基準点にするため */

  background:
    linear-gradient(rgba(0, 0, 0, 0.3) 2px, transparent 2px),
    linear-gradient(90deg, rgba(0, 0, 0, 0.3) 2px, transparent 2px),
    ${(props) => {
      switch (props.status) {
        case "experiment":
          return "radial-gradient(circle, #7c2323 0%, #000000 100%)";
        case "meeting":
          return "radial-gradient(circle, #1a3977 0%, #000000 100%)";
        case "seminar":
          return "radial-gradient(circle, #8a561e 0%, #000000 100%)";
        case "free":
          return "radial-gradient(circle, #338133 0%, #000000 100%)";
        default:
          return "#111"; // loading/error
      }
    }};
  background-size:
    8px 8px,
    8px 8px,
    100% 100%;
`;

const Content = styled.div`
  z-index: 10;
  text-align: center;
`;

const GifImage = styled.img`
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 150px;
  height: auto;
  z-index: 10;
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
      {/* <GifImage src={characterGif} alt="Character" /> */}
    </Container>
  );
}

export default App;

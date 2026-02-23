import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";
import MainText from "./components/mainText.jsx";
import SubInfo from "./components/subInfo.jsx";
import Header from "./components/header.jsx";
import { updateStatus } from "./hooks/updateStatus.js";
import { getStatusInfo } from "./utils/statusHelpers.js";
import frameSVG from "./images/block_koori.svg";
import walkingGif from "./gifs/walking.gif";
import runningGif from "./gifs/running.gif";

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  transition: background 0.5s ease;
  position: relative;
  overflow: hidden; /* 背景からはみ出した部分を隠す */

  background: ${(props) => {
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
        return "#111";
    }
  }};
  /* background-sizeはグラデーション用のみ残す */
  background-size: 100% 100%;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none; /* マウス操作を透過させる */
    z-index: 5; /* 背景GIFより手前 */
    background:
      linear-gradient(rgba(0, 0, 0, 0.3) 2px, transparent 2px),
      linear-gradient(90deg, rgba(0, 0, 0, 0.3) 2px, transparent 2px);
    background-size:
      8px 8px,
      8px 8px;
  }
`;

const Content = styled.div`
  z-index: 10;
  position: relative; /* z-indexを効かせるために必要 */
  text-align: center;
`;

const PixelFrame = styled.div`
  position: absolute;
  top: 0px;
  left: 2px;
  right: 2px;
  bottom: 0px;
  pointer-events: none;
  z-index: 100;

  /* 1. まずは枠全体にブロック画像をタイル状に敷き詰める */
  background-image: url(${frameSVG});
  background-repeat: repeat;
  background-size: 60.6px 60px; /* ブロック1個のサイズ（＝枠の太さ） */
  image-rendering: pixelated;

  /* 2. ここからが魔法のCSS：中央部分を綺麗にくり抜いて透明にする */
  border: 60px solid transparent; /* くり抜きたい枠の太さを指定 */

  /* マスク機能を使って、borderの部分「以外」を透明化する */
  -webkit-mask:
    linear-gradient(#fff 0 0) padding-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;

  mask:
    linear-gradient(#fff 0 0) padding-box,
    linear-gradient(#fff 0 0);
  mask-composite: exclude;
`;

const runAcrossScreen = keyframes`
  0% {
    transform: translateX(-150px);
  }
  100% {
    transform: translateX(100vw);
  }
`;

const RunningCharacter = styled.img`
  position: absolute;
  bottom: 30px;
  left: 0;
  width: 250px;
  height: auto;
  z-index: 15;

  image-rendering: pixelated;
  pointer-events: none;

  animation: ${runAcrossScreen} ${(props) => props.duration} linear infinite;
`;

function App() {
  const { data, currentTime } = updateStatus();
  const { text, category, className } = getStatusInfo(data.status);

  return (
    <Container status={data.status}>
      <Header currentTime={currentTime} />
      <Content className={className}>
        <MainText displayStatus={text} status={data.status} />
        <SubInfo data={data} category={category} />
      </Content>

      <PixelFrame />
      {data.status === "free" ? (
        <RunningCharacter
          src={walkingGif}
          alt="Walking Character"
          duration="30s"
        />
      ) : (
        <RunningCharacter
          src={runningGif}
          alt="Running Character"
          duration="15s"
        />
      )}
    </Container>
  );
}

export default App;

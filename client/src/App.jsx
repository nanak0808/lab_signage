import styled from "@emotion/styled";
import MainText from "./components/mainText.jsx";
import SubInfo from "./components/subInfo.jsx";
import Header from "./components/header.jsx";
import { updateStatus } from "./hooks/updateStatus.js";
import { getStatusInfo } from "./utils/statusHelpers.js";
import characterGif from "./gifs/wink.gif";
import frameSVG from "./images/block_koori.svg";

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

  /* レイヤー1（一番奥）: ステータスごとのグラデーションのみここに残す */
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

  /* レイヤー3（手前）: ドット風の網目を::afterで上に被せる */
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

/* レイヤー2（中間）: 背景全体に広げるGIF用のスタイル */
const BgGif = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover; /* アスペクト比を維持したまま画面を埋め尽くす */
  opacity: 0.15;
  z-index: 1;
  pointer-events: none;
  image-rendering: pixelated; /* ドット絵をくっきりさせる */
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

const GifImage = styled.img`
  position: absolute;
  left: 4%;
  bottom: -110px;
  width: 500px;
  height: auto;
  z-index: 10;
`;

function App() {
  const { data, currentTime } = updateStatus();
  const { text, category, className } = getStatusInfo(data.status);

  return (
    <Container status={data.status}>
      {/* <BgGif src={characterGif} alt="" /> */}
      <Header currentTime={currentTime} />
      <Content className={className}>
        <MainText displayStatus={text} status={data.status} />
        <SubInfo data={data} category={category} />
      </Content>

      <PixelFrame />
      <GifImage src={characterGif} alt="Character" />
    </Container>
  );
}

export default App;

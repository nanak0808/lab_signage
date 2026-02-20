import styled from "@emotion/styled";
import MainText from "./components/mainText.jsx";
import SubInfo from "./components/subInfo.jsx";
import Header from "./components/header.jsx";
import { updateStatus } from "./hooks/updateStatus.js";
import { getStatusInfo } from "./utils/statusHelpers.js";
// 背景に使用するGIF画像
import characterGif from "../public/gifs/wink.gif";

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
  opacity: 0.15; /* ★ここ重要！ 透明度調整（0.1〜0.3くらいがおすすめ） */
  z-index: 1; /* グラデーションと網目の間 */
  pointer-events: none;
  image-rendering: pixelated; /* ドット絵をくっきりさせる */
`;

const Content = styled.div`
  z-index: 10;
  position: relative; /* z-indexを効かせるために必要 */
  text-align: center;
`;

// 右下のGIF用（今回は不要なので削除してもOKですが残しておきます）
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
      {/* ★ここに背景GIFを追加 */}
      <BgGif src={characterGif} alt="" />

      <Content className={className}>
        <Header currentTime={currentTime} />
        <MainText displayStatus={text} status={data.status} />
        <SubInfo data={data} category={category} />
      </Content>

      {/* 右下のGIFは一旦コメントアウトのまま */}
      {/* <GifImage src={characterGif} alt="Character" /> */}
    </Container>
  );
}

export default App;

import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        gap: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1>메인 페이지</h1>
      <button onClick={() => navigate("/community")} style={btnStyle("#2b2d42")}>
        자유 게시판 가기
      </button>
      <button onClick={() => navigate("/dayquest")} style={btnStyle("#4c6ef5")}>
        일일 퀘스트 가기
      </button>
      <button onClick={() => navigate("/ranking")} style={btnStyle("#20c997")}>
        랭킹 페이지 가기
      </button>
      <button onClick={() => navigate("/mypage")} style={btnStyle("#e8590c")}>
        마이페이지 가기
      </button>
    </div>
  );
}

function btnStyle(bgColor) {
  return {
    padding: "12px 24px",
    fontSize: "16px",
    backgroundColor: bgColor,
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  };
}

export default Home;

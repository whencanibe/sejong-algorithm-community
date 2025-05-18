import { useNavigate, Routes, Route, useLocation, BrowserRouter as Router } from "react-router-dom";
import Dayquest from "./pages/Dayquest";
import Community from "./pages/Community";
import WritePost from "./pages/WritePost";
import PostDetail from "./pages/PostDetail";
import Ranking from "./pages/Ranking";
import MyPage from "./pages/MyPage";

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // 메인 페이지 전용 버튼 화면
  if (location.pathname === "/") {
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
        <button
          onClick={() => navigate("/community")}
          style={btnStyle("#2b2d42")}
        >
          자유 게시판 가기
        </button>
        <button
          onClick={() => navigate("/dayquest")}
          style={btnStyle("#4c6ef5")}
        >
          일일 퀘스트 가기
        </button>
        <button
          onClick={() => navigate("/ranking")}
          style={btnStyle("#20c997")}
        >
          랭킹 페이지 가기
        </button>
        <button
          onClick={() => navigate("/mypage")}
          style={btnStyle("#e8590c")}
        >
          마이페이지 가기
        </button>
      </div>
    );
  }

  // 그 외 경로에 따른 라우팅
  return (
    <Routes>
      <Route path="/dayquest" element={<Dayquest />} />
      <Route path="/community" element={<Community />} />
      <Route path="/community/writepost" element={<WritePost />} />
      <Route path="/community/postdetail/:id" element={<PostDetail />} />
      <Route path="/ranking" element={<Ranking />} />
      <Route path="/mypage" element={<MyPage />} />
    </Routes>
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

export default App;

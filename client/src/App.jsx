import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import { useNavigate, Routes, Route, useLocation } from "react-router-dom";
import Dayquest from "./pages/Dayquest";
import Community from "./pages/Community";
import WritePost from "./pages/WritePost";
import PostDetail from "./pages/PostDetail";


function App() {
  const navigate = useNavigate();
  const location = useLocation();

    // 현재 경로가 '/'일 때만 메인 버튼 화면 보여주기
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
            style={{
              padding: "12px 24px",
              fontSize: "16px",
              backgroundColor: "#2b2d42",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            자유 게시판 가기
          </button>
          <button
            onClick={() => navigate("/dayquest")}
            style={{
              padding: "12px 24px",
              fontSize: "16px",
              backgroundColor: "#4c6ef5",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            일일 퀘스트 가기
          </button>
        </div>
      );
    }
  
    // 그 외 모든 경로는 해당 컴포넌트만 단독 렌더링
    return (
      <Routes>
        <Route path="/dayquest" element={<Dayquest />} />
        <Route path="/community" element={<Community />} />
        <Route path="/community/writepost" element={<WritePost />} />
        <Route path="/community/postdetail/:id" element={<PostDetail />} />
      </Routes>
    );
  }
  
  export default App;


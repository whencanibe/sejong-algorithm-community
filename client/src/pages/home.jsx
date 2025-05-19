import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// ✅ 더미 데이터로 출력되는 백준 컴포넌트
function BaekjoonProfile() {
  const userInfo = {
    handle: "rlatlql123",
    tier: 15,
    ratingRank: 3284,
  };

  return (
    <div
      style={{
        border: "2px solid #3f3fff",
        padding: "20px",
        borderRadius: "10px",
        width: "500px",
        display: "flex",
        gap: "20px",
        alignItems: "center",
      }}
    >
      <img
        src={`https://static.solved.ac/tier/tier${userInfo.tier}.svg`}
        alt="백준티어"
        style={{ width: "80px", height: "80px" }}
      />
      <div>
        <h2 style={{ fontSize: "20px", fontWeight: "bold" }}>
          닉네임: <span style={{ color: "#3f3fff" }}>{userInfo.handle}</span>
        </h2>
        <p>상위 약 {userInfo.ratingRank}위</p>
        <div
          style={{
            border: "1px solid #3f3fff",
            padding: "8px",
            fontSize: "14px",
            color: "#3f3fff",
          }}
        >
          그래프 제작
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const [selectedFootprint, setSelectedFootprint] = useState(null);

  const navBtnStyle = {
    backgroundColor: "transparent",
    border: "none",
    color: "white",
    fontWeight: "normal",
    fontSize: "15px",
    cursor: "pointer",
    padding: "4px 8px",
  };

  return (
    <div>
      {/* 상단바 */}
      <header
        style={{
          width: "100%",
          backgroundColor: "#2b2d42",
          color: "white",
          padding: "18px 40px",
          fontSize: "18px",
          fontWeight: "bold",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxSizing: "border-box",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 1000,
        }}
      >
        <div style={{ flexShrink: 0 }}>SEJONG-Algorithm</div>

        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <button onClick={() => navigate("/ranking")} style={navBtnStyle}>랭킹</button>
          <button onClick={() => navigate("/dayquest")} style={navBtnStyle}>일일퀘스트</button>
          <button onClick={() => navigate("/community")} style={navBtnStyle}>자유게시판</button>
          <button onClick={() => navigate("/mypage")} style={navBtnStyle}>마이페이지</button>
          <button
            onClick={() => (window.location.href = "/")}
            style={{
              padding: "8px 16px",
              fontSize: "14px",
              backgroundColor: "white",
              color: "#2b2d42",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            홈으로
          </button>
        </div>
      </header>

     {/* 좌측 상단 컨테이너 */}
<div style={{ position: "absolute", top: "100px", left: "40px", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "20px" }}>
  {/* 발자국 */}
  <div style={{ display: "flex", gap: "10px" }}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <img
            key={i}
            src="/발자국.png"
            alt={`footprint-${i}`}
            onClick={() => setSelectedFootprint(i)}
            style={{
              width: "60px",
              top:"100px",
              left:"40px",
              height: "60px",
              cursor: "pointer",
              transition: "0.2s",
              transform: `rotate(${i % 2 === 0 ? "-270deg" : "120deg"}) scaleX(${i % 2 === 0 ? 1 : -1})`,
              filter:
                selectedFootprint === i
                  ? "brightness(1.2) drop-shadow(0 0 8px #4dabf7)"
                  : "grayscale(70%) opacity(0.8)",
            }}
          />
        ))}
      </div>

  {/* 백준 프로필 */}
  <BaekjoonProfile />
</div>
      {/* 메인 콘텐츠 */}
      <div className="grid grid-cols-3 gap-6 mt-16 px-10">
        <div className="bg-indigo-50 p-4 rounded-lg shadow">
          <p className="font-bold">캡슐형 퀘스트 (예: 다리놓기)</p>
        </div>
        <div className="bg-indigo-50 p-4 rounded-lg shadow">
          <p className="font-bold">자유게시판</p>
        </div>
        <div className="bg-indigo-50 p-4 rounded-lg shadow">
          <p className="font-bold">카드 생성 버튼</p>
        </div>
      </div>
    </div>
  );
}
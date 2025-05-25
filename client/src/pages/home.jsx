import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import BaekjoonProfile from "../components/BaekjoonProfile";
import MyProfile from "../components/MyProfile";
import QuestCapsule from "../components/QuestCapsule";
import FreeBoardPreview from "../components/FreeBoard";
import CardAlbum from "../components/CardAlbum";
import axios from "axios";


  

// 더미 문제 (오늘의 퀘스트), 백준 문제 DB 연결결
const dummyTop100 = [
  { problemId: 1000, title: "다리놓기" },
  { problemId: 1001, title: "피보나치" },
];

export default function Home() {
  const navigate = useNavigate();
  const todayProblem = dummyTop100[0];
   const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:4000/posts")
      .then((res) => {
        const recent = res.data.slice(0, 3); // 최근 3개만
        setPosts(recent);
      })
      .catch((err) => {
        console.error("게시글 불러오기 실패:", err);
      });
  }, []);



  // 발자국 출석 상태 백엔드 
  const [footprints, setFootprints] = useState(() => {
    const saved = localStorage.getItem("footprints");
    return saved ? JSON.parse(saved) : Array(7).fill(false);
  });

  // 카드 보관함 상태 백엔드 연결 
  const [cards, setCards] = useState(() => {
    const saved = localStorage.getItem("cards");
    return saved ? JSON.parse(saved) : [];
  });

  // 카드 중복 지급 방지 연결
  const [rewardGiven, setRewardGiven] = useState(() => {
    return localStorage.getItem("rewardGiven") === "true";
  });

  // 상단 네비게이션 버튼 스타일
  const navBtnStyle = {
    backgroundColor: "transparent",
    border: "none",
    color: "white",
    fontWeight: "normal",
    fontSize: "15px",
    cursor: "pointer",
    padding: "4px 8px",
  };

  // 발자국 클릭 시(= 문제를 풀면 자동으로 바뀌게) 출석 처리 
  const handleFootprintClick = (index) => {
    const updated = [...footprints];
    updated[index] = true;
    setFootprints(updated);
    localStorage.setItem("footprints", JSON.stringify(updated));
  };

  // 출석 6개 완료 시 카드 지급 (미리 카드 DB 연결 필요요)
  useEffect(() => {
    const allChecked = footprints.every(Boolean);
    if (allChecked && !rewardGiven) {
      const today = new Date().toISOString().split("T")[0];
      const newCards = [
        { title: "끈기 카드", comment : "쉽지 않았지만 끝까지 해냈어요!", image: "/카드/끈기.png" },
  { title: "문제해결 카드", comment : "스스로 해답을 찾아낸 똑똑한 우주인!", image: "/카드/문제해결.png" },
  { title: "인내 카드", comment : "끝까지 포기하지 않는 우주인!", image: "/카드/인내.png" },
  { title: "꾸준 카드", comment : "오래 걸려도 끝까지 도전!", image: "/카드/꾸준.png" },
  { title: "도전 카드", comment : "처음 푸는 유형도 멋지게 도전Q", image: "/카드/도전.png" },
  { title: "정직 카드", comment : "올바르게, 스스로 풀었어요!", image: "/카드/정직.png" },
  { title: "성실 카드", comment : "언제나 꾸준하게 임무 수행!", image: "/카드/성실.png" },
];
      const randomIndex = Math.floor(Math.random() * newCards.length);
const selectedCard = newCards[randomIndex];
      const updatedCards = [selectedCard, ...cards];
      setCards(updatedCards);
      setRewardGiven(true);
      localStorage.setItem("cards", JSON.stringify(updatedCards));
      localStorage.setItem("rewardGiven", "true");
    }
  }, [footprints, rewardGiven]);

  return (
    <div>
      {/* 🔹 상단바 */}
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
        <div>SEJONG-Algorithm</div>

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

      {/* 발자국 출석 */}
      <div style={{ display: "flex", gap: "20px", marginTop: "120px"}}>
          {footprints.map((filled, i) => (
            <img
              key={i}
              src="/발자국.png"
              alt={`footprint-${i}`}
              onClick={() => handleFootprintClick(i)}
              style={{
                width: "70px",
                height: "70px",
                cursor: "pointer",
                transition: "0.3s",
                transform: `rotate(${i % 2 === 0 ? "-270deg" : "120deg"}) scaleX(${i % 2 === 0 ? 1 : -1})`,
                filter: filled
                  ? "brightness(1.2) drop-shadow(0 0 8px #4dabf7)"
                  : "grayscale(70%) opacity(0.8)",
              }}
            />
          ))}
        </div>


        {/* 초기화 버튼 */}
  <button
    onClick={() => {
      localStorage.removeItem("footprints");
      localStorage.removeItem("cards");
      localStorage.removeItem("rewardGiven");
      window.location.reload();
    }}
    style={{
      marginLeft: "30px", 
      padding: "8px 12px",
      backgroundColor: "#ff6b6b",
      color: "white",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
    }}
  >
    초기화하기
  </button>


      {/* 전체 콘텐츠 영역 */}
      <div style={{ padding: "40px", marginTop: "30px" }}>
        {/* 백준 프로필 + 마이프로필 */}
<div style={{ display: "flex", gap: "20px", alignItems: "flex-start", marginBottom: "40px" }}>
  <BaekjoonProfile handle="rlatlql123" tier={15} ratingRank={3284} />
  <MyProfile
    nickname="혜서"
    info="세종대 알고리즘 커뮤니티 운영자"
    avatarSeed="혜서"
  />
</div>

        {/* 퀘스트 + 자유게시판 + 카드첩 */}
        <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
          <QuestCapsule problem={todayProblem} />
          <FreeBoardPreview posts={posts} />
          <CardAlbum cards={cards} />
        </div>

        
      </div>
    </div>
  );
}

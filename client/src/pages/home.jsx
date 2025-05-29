import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BaekjoonProfile from "../components/BaekjoonProfile";
import MyProfile from "../components/MyProfile";
import QuestCapsule from "../components/QuestCapsule";
import FreeBoardPreview from "../components/FreeBoard";
import CardAlbum from "../components/CardAlbum";
import axios from "axios";

export default function Home() {
  const navigate = useNavigate();
   const [todayProblem, setTodayProblem] = useState(null);
  const [posts, setPosts] = useState([]);
  const [footprints, setFootprints] = useState(() => {
    const saved = localStorage.getItem("footprints");
    return saved ? JSON.parse(saved) : Array(7).fill(false);
  });
  const [cards, setCards] = useState(() => {
    const saved = localStorage.getItem("cards");
    return saved ? JSON.parse(saved) : [];
  });
  const [rewardGiven, setRewardGiven] = useState(() => {
    return localStorage.getItem("rewardGiven") === "true";
  });
  const [showCardModal, setShowCardModal] = useState(false);
  const [newCard, setNewCard] = useState(null);

  
  const [bojInfo, setBojInfo] = useState({ baekjoonName: '' });

useEffect(() => {
  axios.get('http://localhost:4000/info/api/mypage', { withCredentials: true })
    .then(res => {
      setBojInfo({ baekjoonName: res.data.baekjoonName }); // ✅ 정확한 키로 설정
    })
    .catch(err => {
      console.error('백준 닉네임 불러오기 실패:', err);
    });
}, []);




  useEffect(() => {
    axios.get('http://localhost:4000/dayquest/status', { withCredentials: true })
      .then(res => {
        const { problemId, title } = res.data;
      setTodayProblem({ problemId, title });
      })
      .catch(err => {
        console.error('오늘의 문제 불러오기 실패:', err);
      });
  }, []);




  useEffect(() => {
    axios.get("http://localhost:4000/posts")
      .then((res) => setPosts(res.data.slice(0, 3)))
      .catch((err) => console.error("게시글 불러오기 실패:", err));
  }, []);

  useEffect(() => {
  const allChecked = footprints.every(Boolean);
  if (allChecked && !rewardGiven) {
    axios.post("http://localhost:4000/card/reward", { stampCount: 7,}, { withCredentials: true })
      .then(res => {
        const selectedCard = res.data.card;  // 서버가 준 카드
        const updatedCards = [selectedCard, ...cards];
        setCards(updatedCards);
        setNewCard(selectedCard);            // 모달에 쓸 카드 설정
        setShowCardModal(true);              // 카드 모달 띄우기
        setRewardGiven(true);
      })
      .catch(err => {
        console.warn("카드 지급 실패:", err.response?.data?.error || err.message);
      });
  }
}, [footprints, rewardGiven]);




  const navBtnStyle = {
    backgroundColor: "transparent",
    border: "none",
    color: "#b3e5fc",
    fontWeight: "normal",
    fontSize: "15px",
    cursor: "pointer",
    padding: "4px 8px",
  };

  const handleFootprintClick = (index) => {
    const updated = [...footprints];
    updated[index] = true;
    setFootprints(updated);
    localStorage.setItem("footprints", JSON.stringify(updated));
  };


  const closeCardModal = () => {
    setShowCardModal(false);
  };

  if (!todayProblem) return <div>로딩 중...</div>;

  return (
    <div style={{ backgroundColor: "#0d1117", color: "#e0f7fa", minHeight: "100vh" }}>
        
       {/* 🌟 Floating Stars with animation */}
      <img src="/public/배경/star1.png" className="twinkle" style={{ position: "absolute", top: "60px", left: "20px", width: "40px", zIndex: 0 }} alt="star1" />
<img src="/public/배경/star1.png" className="twinkle" style={{ position: "absolute", top: "120px", left: "80vw", width: "32px", zIndex: 0 }} alt="star1" />
<img src="/public/배경/star1.png" className="twinkle" style={{ position: "absolute", top: "30vh", left: "30vw", width: "28px", zIndex: 0 }} alt="star1" />
<img src="/public/배경/star1.png" className="twinkle" style={{ position: "absolute", top: "90vh", left: "90vw", width: "22px", zIndex: 0 }} alt="star1" />
<img src="/public/배경/star1.png" className="twinkle" style={{ position: "absolute", top: "15vh", left: "5vw", width: "30px", zIndex: 0 }} alt="star1" />
<img src="/public/배경/star1.png" className="twinkle" style={{ position: "absolute", top: "45vh", left: "85vw", width: "25px", zIndex: 0 }} alt="star1" />

<img src="/public/배경/star1.png" className="twinkle" style={{ position: "absolute", top: "88vh", left: "15vw", width: "22px", zIndex: 0 }} alt="star1" />
<img src="/public/배경/star1.png" className="twinkle" style={{ position: "absolute", top: "92vh", left: "35vw", width: "25px", zIndex: 0 }} alt="star1" />
<img src="/public/배경/star1.png" className="twinkle" style={{ position: "absolute", top: "95vh", left: "50vw", width: "28px", zIndex: 0 }} alt="star1" />
<img src="/public/배경/star1.png" className="twinkle" style={{ position: "absolute", top: "98vh", left: "65vw", width: "24px", zIndex: 0 }} alt="star1" />
<img src="/public/배경/star1.png" className="twinkle" style={{ position: "absolute", top: "99vh", left: "85vw", width: "30px", zIndex: 0 }} alt="star1" />

      <header style={{
        width: "100%",
        backgroundColor: "#121826",
        color: "#b3e5fc",
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
        boxShadow: "0 2px 10px #00e5ff55"
      }}>
        <div style={{ textShadow: "0 0 8px #00e5ff", animation: "neon-flicker 1.5s infinite alternate" }}>SEJONG-Algorithm</div>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <button onClick={() => navigate("/ranking")} style={navBtnStyle}>랭킹</button>
          <button onClick={() => navigate("/dayquest")} style={navBtnStyle}>일일퀘스트</button>
          <button onClick={() => navigate("/community")} style={navBtnStyle}>자유게시판</button>
          <button onClick={() => navigate("/mypage")} style={navBtnStyle}>마이페이지</button>
          <button
            onClick={() => (window.location.href = "/home")}
            style={{
              padding: "8px 16px",
              fontSize: "14px",
              backgroundColor: "#00e5ff",
              color: "#0d1117",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold",
              boxShadow: "0 0 10px #00e5ff"
            }}
          >
            홈으로
          </button>
        </div>
      </header>

            

      <div style={{ display: "flex", gap: "20px", marginTop: "120px", paddingLeft: "40px" }}>
        

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
                ? "brightness(1.5) drop-shadow(0 0 10px #00e5ff)"
                : "grayscale(70%) opacity(0.5)",
            }}
          />
        ))}

        {/* 발자국 오른쪽에 우주 외계인 이미지 */}
  <img
    src="/public/배경/달.png"
    alt="moon"
    style={{
      width: "100px",
      height: "auto",
      
    }}
  />
      <img
  src="/public/배경/우주인.png" // 네가 방금 올린 파일 경로에 맞게 바꿔줘!
  alt="floating-astronaut"
  style={{
    position: "absolute",
    top: "180px",
    right: "250px",
    width: "140px",
    animation: "float-spin 3s ease-in-out infinite",
    zIndex: 1,
    filter: "drop-shadow(0 0 8px white)",
  }}
/>


      </div>

      <button
        onClick={() => {
          localStorage.clear();
          window.location.reload();
        }}
        style={{
          marginLeft: "40px",
          marginTop: "10px",
          padding: "8px 12px",
          backgroundColor: "#ff4081",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          boxShadow: "0 0 8px #ff4081",
        }}
      >
        초기화하기
      </button>

      <div style={{ padding: "40px", marginTop: "30px" }}>
  {/* 백준 프로필 + 마이프로필 */}
  <div style={{ display: "flex", gap: "20px", alignItems: "flex-start", marginBottom: "40px" }}>
    {bojInfo && (
  <BaekjoonProfile handle={bojInfo.handle} tier={15} ratingRank={3284} />
)}

    <MyProfile nickname="혜서" info="세종대 알고리즘 커뮤니티 운영자" avatarSeed="혜서" />
  </div>

  {/* 퀘스트 + 외계인 + 다른 컴포넌트 */}
  <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
    
    {/*  퀘스트 캡슐 + 외계인들 묶음 */}
    <div style={{ position: "relative" }}>
      <QuestCapsule problem={todayProblem} />

      {/* 외계인 3마리 - 퀘스트 캡슐 위에 떠다니게 */}
      <img src="/public/배경/에일리언.png" className="alien alien1" alt="alien1" />
      <img src="/public/배경/에일리언.png" className="alien alien2" alt="alien2" />
      <img src="/public/배경/에일리언.png" className="alien alien3" alt="alien3" />
    </div>

    {/* 자유게시판 프리뷰 */}
    <FreeBoardPreview posts={posts} />
    
    {/* 카드첩 */}
    <CardAlbum cards={cards} />
  </div>
</div>


      {showCardModal && newCard && (
  <div style={{
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2000,
  }}>
    <div style={{
      position: "relative",
      backgroundColor: "#121826",
      padding: "20px",
      borderRadius: "20px",
      width: "300px", // 💡 크기 줄임!
      textAlign: "center",
      boxShadow: "0 0 20px #00e5ff",
      animation: "neon-flicker 1.5s infinite alternate"
    }}>
      {/* X 버튼 */}
      <button
        onClick={closeCardModal}
        style={{
          position: "absolute",
          top: "-15px",
          right: "-15px",
          background: "#ff4081",
          border: "none",
          borderRadius: "50%",
          color: "#fff",
          fontWeight: "bold",
          fontSize: "16px",
          cursor: "pointer",
          width: "32px",
          height: "32px",
          boxShadow: "0 0 8px #ff4081",
          zIndex: 10
        }}
      >
        ✕
      </button>

      <h2 style={{ color: "#00e5ff", marginBottom: "12px" }}>🎉 새로운 카드 획득!</h2>
      <img
        src={newCard.image}
        alt={newCard.title}
        style={{
          width: "100%",
          borderRadius: "12px",
          boxShadow: "0 0 10px #00e5ff"
        }}
      />
      <p style={{ marginTop: "12px", color: "#e0f7fa" }}>{newCard.comment}</p>
    </div>
  </div>
)}

       
    </div>
  );
}

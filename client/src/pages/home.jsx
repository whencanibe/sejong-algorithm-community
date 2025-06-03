import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BaekjoonProfile from "../components/BaekjoonProfile";
import MyProfile from "../components/MyProfile";
import QuestCapsule from "../components/QuestCapsule";
import FreeBoardPreview from "../components/FreeBoard";
import CardAlbum from "../components/CardAlbum";
import axios from "axios";
import AttendanceAndCardAlbum from "../components/Attendanceandcardalbum";
import LoginWindow from '../components/LoginWindow';

export default function Home() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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
  const [basicInfo, setBasicInfo] = useState(null);

  const [baekjoonProfile, setBaekjoonProfile] = useState({
    handle: '',
    tier: null,
    ratingRank: null,
    rankpercentile: null,
  });

  useEffect(() => {
    if (!isLoggedIn) return;
    axios.get("http://localhost:4000/card/me", { withCredentials: true })
      .then(res => setCards(res.data))
      .catch(err => console.error("카드 불러오기 실패:", err));
  }, [isLoggedIn]);

  useEffect(() => {
    axios.get("http://localhost:4000/info/api/basicprofile", { withCredentials: true })
      .then(res => {
        setBasicInfo(res.data);
        setIsLoggedIn(true);
      })
      .catch(err => {
        console.error("기본 프로필 불러오기 실패:", err);
        setIsLoggedIn(false);
        setBasicInfo(null);
      });
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return;
    const fetchBaekjoonProfile = async () => {
      try {
        const res = await axios.get('http://localhost:4000/info/api/mypage', { withCredentials: true });
        const { baekjoonName, tier, rankpercentile, rank } = res.data;
        setBaekjoonProfile({ handle: baekjoonName, tier, ratingRank: rank, rankpercentile });
      } catch (err) {
        console.error('백준 정보 불러오기 실패:', err);
      }
    };
    fetchBaekjoonProfile();
  }, [isLoggedIn]);

  useEffect(() => {
    axios.get('http://localhost:4000/dayquest/problem', { withCredentials: true })
      .then(res => {
        const { todayProblemId, todayProblemTitle } = res.data;
        setTodayProblem({ problemId: todayProblemId, title: todayProblemTitle });
      })
      .catch(err => {
        console.error('오늘의 문제 불러오기 실패:', err);
      });
  }, []);

  useEffect(() => {
    axios.get("http://localhost:4000/posts", { withCredentials: true })
      .then(res => setPosts(res.data.slice(0, 3)))
      .catch(err => console.error("게시글 불러오기 실패:", err));
  }, [isLoggedIn]);

  const navBtnStyle = {
    backgroundColor: "transparent",
    border: "none",
    color: "#b3e5fc",
    fontWeight: "normal",
    fontSize: "15px",
    cursor: "pointer",
    padding: "4px 8px"
  };

  const closeCardModal = () => setShowCardModal(false);

  if (!todayProblem) return <div>로딩 중...</div>;

  return (
    <div style={{ backgroundColor: "#0d1117", color: "#e0f7fa", minHeight: "100vh" }}>
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
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 1000,
        boxShadow: "0 2px 10px #00e5ff55"
      }}>
        <div style={{ fontSize: "22px", textShadow: "0 0 8px #00e5ff" }}>SEJONG-Universe</div>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <button onClick={() => navigate("/ranking")} style={navBtnStyle}>랭킹</button>
          <button onClick={() => navigate("/dayquest")} style={navBtnStyle}>일일퀘스트</button>
          <button onClick={() => navigate("/community")} style={navBtnStyle}>자유게시판</button>
          <button onClick={() => navigate("/mypage")} style={navBtnStyle}>마이페이지</button>
          {isLoggedIn ? (
            <button onClick={async () => {
              try {
                await axios.get("http://localhost:4000/user/logout", { withCredentials: true });
                setIsLoggedIn(false);
                setBasicInfo(null);
                window.location.href = "/";
              } catch (err) {
                console.error("로그아웃 실패:", err);
              }
            }} style={navBtnStyle}>로그아웃</button>
          ) : (
            <button onClick={() => navigate("/login")} style={navBtnStyle}>로그인</button>
          )}
          <button onClick={() => (window.location.href = "/")} style={{
            padding: "8px 16px",
            fontSize: "14px",
            backgroundColor: "#00e5ff",
            color: "#0d1117",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold",
            boxShadow: "0 0 10px #00e5ff",
            marginRight: "60px",
          }}>홈으로</button>
        </div>
      </header>

      <div style={{ display: "flex", gap: "20px", marginTop: "50px", paddingLeft: "40px" }}>
        <AttendanceAndCardAlbum />
      </div>


      <div style={{ padding: "40px", marginTop: "30px" }}>
        <div style={{ display: "flex", gap: "20px", alignItems: "flex-start", marginBottom: "40px" }}>
          <BaekjoonProfile {...baekjoonProfile} />
          {basicInfo ? (
            <MyProfile nickname={basicInfo.name} department={basicInfo.department} imgUrl={basicInfo.profileImage} />
          ) : (
            <LoginWindow onLoginSuccess={(userInfo) => { setBasicInfo(userInfo); setIsLoggedIn(true); }} />
          )}
        </div>

        <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
          <div style={{ position: "relative" }}>
            <QuestCapsule problem={todayProblem} />
            <img src="/public/배경/에일리언.png" className="alien alien1" alt="alien1" />
            <img src="/public/배경/에일리언.png" className="alien alien2" alt="alien2" />
            <img src="/public/배경/에일리언.png" className="alien alien3" alt="alien3" />
          </div>
          <FreeBoardPreview posts={posts} isLoggedIn={isLoggedIn} />
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
          zIndex: 2000
        }}>
          <div style={{
            position: "relative",
            backgroundColor: "#121826",
            padding: "20px",
            borderRadius: "20px",
            width: "400px",
            textAlign: "center",
            boxShadow: "0 0 20px #00e5ff",
            animation: "neon-flicker 1.5s infinite alternate"
          }}>
            <button onClick={closeCardModal} style={{
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
            }}>✕</button>
            <h2 style={{ color: "#00e5ff", marginBottom: "12px" }}>🎉 새로운 카드 획득!</h2>
            <img src={newCard.image} alt={newCard.title} style={{ width: "100%", borderRadius: "12px", boxShadow: "0 0 10px #00e5ff" }} />
            <p style={{ marginTop: "12px", color: "#e0f7fa" }}>{newCard.comment}</p>
          </div>
        </div>
      )}
    </div>
  );
}

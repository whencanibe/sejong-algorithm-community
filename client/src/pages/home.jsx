import React, { useEffect, useState } from "react"; // React 훅 임포트
import { useNavigate } from "react-router-dom"; // 라우터 네비게이션 훅 임포트
import BaekjoonProfile from "../components/BaekjoonProfile"; // 백준 프로필 컴포넌트 임포트
import MyProfile from "../components/MyProfile"; // 내 프로필 컴포넌트 임포트
import QuestCapsule from "../components/QuestCapsule"; // 퀘스트 캡슐 컴포넌트 임포트
import FreeBoardPreview from "../components/FreeBoard"; // 자유 게시판 미리보기 컴포넌트 임포트
import CardAlbum from "../components/CardAlbum"; // 카드 앨범 컴포넌트 임포트
import axios from "axios"; // HTTP 요청 라이브러리 axios 임포트
import AttendanceAndCardAlbum from "../components/Attendanceandcardalbum"; // 출석 및 카드 앨범 컴포넌트 임포트
import LoginWindow from '../components/LoginWindow'; // 로그인 창 컴포넌트 임포트
import StarField from "../components/StarField";
import './Home.css';
import '../App.css';
export default function Home() {
  // 페이지 이동을 위한 훅
  const navigate = useNavigate();

  // 1. 로그인 / 유저 정보 관련 상태
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [basicInfo, setBasicInfo] = useState(null);

  // 2. 출석 관련 상태 (발자국)
  const [footprints, setFootprints] = useState(() => {
    const saved = localStorage.getItem("footprints");
    return saved ? JSON.parse(saved) : Array(7).fill(false);
  });

  // 3. 카드 관련 상태
  const [cards, setCards] = useState(() => {
    const saved = localStorage.getItem("cards");
    return saved ? JSON.parse(saved) : [];
  });
  const [rewardGiven, setRewardGiven] = useState(() => {
    return localStorage.getItem("rewardGiven") === "true";
  });
  const [showCardModal, setShowCardModal] = useState(false);
  const [newCard, setNewCard] = useState(null);

  // 4. 백준 프로필 관련 상태
  const [baekjoonProfile, setBaekjoonProfile] = useState({
    handle: '',
    tier: null,
    ratingRank: null,
    percentile: null,
    nickname: '',
    rankingData: []
  });
  const [globalRanking, setGlobalRanking] = useState([]);
  const [deptRanking, setDeptRanking] = useState([]);

  // 5. 오늘의 문제 & 게시판
  const [todayProblem, setTodayProblem] = useState(null);
  const [posts, setPosts] = useState([]);



  // 로그인 여부 확인 → 기본 프로필 불러오기
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

  // 로그인 후 → 카드 목록 불러오기
  useEffect(() => {
    if (!isLoggedIn) return;
    axios.get("http://localhost:4000/card/me", { withCredentials: true })
      .then(res => setCards(res.data))
      .catch(err => console.error("카드 불러오기 실패:", err));
  }, [isLoggedIn]);

  // 로그인 후 → 백준 프로필 & 랭킹 정보 불러오기
  useEffect(() => {
    if (!isLoggedIn) return;

    const fetchData = async () => {
      try {
        // 세션 갱신
        await axios.post(`http://localhost:4000/info/api/refresh`, {}, {
          withCredentials: true,
        });
        const res = await axios.get('http://localhost:4000/info/api/mypage', { withCredentials: true });
        const { baekjoonName, tier, rank, name } = res.data;

        const rankRes = await axios.get('http://localhost:4000/info/api/globalranking', { withCredentials: true });

        setBaekjoonProfile({
          handle: baekjoonName,
          tier,
          ratingRank: rank,
          nickname: name,
          rankingData: rankRes.data
        });
      } catch (err) {
        console.error('백준 정보 불러오기 실패:', err);
      }
    };

    fetchData();
  }, [isLoggedIn]);

  // 로그인 후 → 학과별 랭킹만 따로 불러오기
  useEffect(() => {
    if (!isLoggedIn) return;

    axios.get("http://localhost:4000/info/api/globalranking", { withCredentials: true })
      .then(res => setDeptRanking(res.data))
      .catch(err => console.error("대학 랭킹 불러오기 실패:", err));
  }, [isLoggedIn]);

  // 마운트 시 → 오늘의 문제 불러오기
  useEffect(() => {
    axios.get('http://localhost:4000/dayquest/problem', { withCredentials: true })
      .then(res => {
        const { todayProblemId, todayProblemTitle } = res.data;
        setTodayProblem({ problemId: todayProblemId, title: todayProblemTitle });
      })
      .catch(err => console.error('오늘의 문제 불러오기 실패:', err));
  }, []);

  // 로그인 후 → 게시판 글 3개만 미리보기
  useEffect(() => {
    axios.get("http://localhost:4000/posts", { withCredentials: true })
      .then(res => setPosts(res.data.slice(0, 3)))
      .catch(err => console.error("게시글 불러오기 실패:", err));
  }, [isLoggedIn]);

  // 새 카드 모달 닫기 함수
  const closeCardModal = () => setShowCardModal(false);


  if (!todayProblem) return <div>로딩 중...</div>;

  // 메인 컴포넌트 렌더링
  return (
    <div className="home-container">
      {/*  배경 별 이미지들 */}
      <StarField />


      {/* 헤더 섹션 */}
      <header className="home-header">

        {/* 로고 */}
        <div className="header-logo">SEJONG-Universe</div>
        {/* 네비게이션 버튼들 */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <button onClick={() => navigate("/ranking")} className="nav-btn">랭킹</button>
          <button onClick={() => navigate("/dayquest")} className="nav-btn">일일퀘스트</button>
          <button onClick={() => navigate("/community")} className="nav-btn">자유게시판</button>
          <button onClick={() => navigate("/mypage")} className="nav-btn">마이페이지</button>

          {/* 로그인 상태에 따라 로그아웃 또는 로그인 버튼 표시 */}
          {isLoggedIn ? (
            <button onClick={async () => {
              try {
                await axios.get("http://localhost:4000/user/logout", { withCredentials: true });
                localStorage.removeItem("myPage:userInfo"); // 로그아웃 하면 userInfo 캐시 지우기
                setIsLoggedIn(false);
                setBasicInfo(null);
                window.location.href = "/";
              } catch (err) {
                console.error("로그아웃 실패:", err); // 로그아웃 실패 시 에러 콘솔 출력
              }
            }} className="nav-btn">로그아웃</button>
          ) : (
            <button onClick={() => navigate("/login")} className="nav-btn">로그인</button>
          )}
          {/* 홈으로 이동 버튼 */}
          <button onClick={() => (window.location.href = "/")} className="home-btn">홈으로</button>
        </div>
      </header>

      {/* 출석 및 카드 앨범 섹션 */}
      <div style={{ display: "flex", gap: "20px", marginTop: "50px", paddingLeft: "40px" }}>
        <AttendanceAndCardAlbum isLoggedIn={isLoggedIn} />
        {/* 발자국 오른쪽에 우주 외계인 이미지 */}
        <div>
          <img
            src="/public/배경/달.png"
            alt="floating-astronaut"
            className="moon"
          />
        </div>
        <img
          src="/public/배경/우주인.png"
          alt="floating-astronaut"
          className="astronaut"
        />

      </div>

      {/* 프로필 및 주요 정보 섹션 */}
      <div className=".main-content">
        <div style={{ display: "flex", gap: "20px", alignItems: "flex-start", marginBottom: "20px" }}>
          {/* 백준 프로필 컴포넌트 (클릭 시 랭킹 페이지로 이동) */}
          <div onClick={() => navigate("/ranking")} style={{ cursor: "pointer" }}>
            <BaekjoonProfile
              handle={baekjoonProfile.handle}
              tier={baekjoonProfile.tier}
              ratingRank={baekjoonProfile.ratingRank}
              nickname={baekjoonProfile.nickname}
              rankingData={deptRanking}
            />
          </div>

          {/* 내 프로필 또는 로그인 창 컴포넌트 (로그인 상태에 따라 다르게 표시) */}
          {basicInfo ? (
            <div onClick={() => navigate("/mypage")} style={{ cursor: "pointer" }}>
              <MyProfile
                nickname={basicInfo.name}
                department={basicInfo.department}
                imgUrl={basicInfo.profileImage}
              />
            </div>
          ) : (
            <LoginWindow onLoginSuccess={(userInfo) => { setUserInfo(userInfo); setIsLoggedIn(true); }} />
          )}
        </div>


        <div className="bottom-section">
          {/* 퀘스트 */}
          <div className="quest-container" onClick={() => navigate("/dayquest")}>
            <QuestCapsule problem={todayProblem} />
            <img src="/public/배경/에일리언.png" className="alien alien1" alt="alien1" />
            <img src="/public/배경/에일리언.png" className="alien alien2" alt="alien2" />
            <img src="/public/배경/에일리언.png" className="alien alien3" alt="alien3" />
          </div>

          {/* 자유게시판 */}
          <div className="freeboard-container" onClick={() => navigate("/community")}>
            <FreeBoardPreview posts={posts} isLoggedIn={isLoggedIn} />
          </div>

          {/* 카드 앨범 */}
          <div className="album-container" onClick={() => navigate("/cardalbum")}>
            <CardAlbum cards={cards} />
          </div>
        </div>


        {/* 새 카드 획득 모달 (showCardModal이 true이고 newCard가 있을 때만 표시) */}
        {showCardModal && newCard && (
          <div className="card-modal">
            <div className="card-modal-content">
              <button className="modal-close-btn">✕</button>
              <h2>🎉 새로운 카드 획득!</h2>
              <img src={newCard.image} className="modal-card-img" />
              <p>{newCard.comment}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
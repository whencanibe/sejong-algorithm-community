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

export default function Home() {
  // `useNavigate` 훅을 사용하여 페이지 이동 기능을 활성화
  const navigate = useNavigate();

  // 상태(State) 변수 정의
  const [userInfo, setUserInfo] = useState(null); // 사용자 정보
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 (true: 로그인, false: 로그아웃)
  const [todayProblem, setTodayProblem] = useState(null); // 오늘의 문제 정보
  const [posts, setPosts] = useState([]); // 자유 게시판 게시글 목록 (미리보기에 사용)

  // `footprints` 상태: 7일간의 출석 여부를 저장하며, 로컬 스토리지에서 불러오거나 초기화
  const [footprints, setFootprints] = useState(() => {
    const saved = localStorage.getItem("footprints");
    return saved ? JSON.parse(saved) : Array(7).fill(false);
  });

  // `cards` 상태: 사용자가 획득한 카드 목록을 저장하며, 로컬 스토리지에서 불러오거나 초기화
  const [cards, setCards] = useState(() => {
    const saved = localStorage.getItem("cards");
    return saved ? JSON.parse(saved) : [];
  });

  // `rewardGiven` 상태: 오늘 보상이 지급되었는지 여부를 저장하며, 로컬 스토리지에서 불러오거나 초기화
  const [rewardGiven, setRewardGiven] = useState(() => {
    return localStorage.getItem("rewardGiven") === "true";
  });

  const [showCardModal, setShowCardModal] = useState(false); // 새 카드 획득 모달 표시 여부
  const [newCard, setNewCard] = useState(null); // 새로 획득한 카드 정보
  const [basicInfo, setBasicInfo] = useState(null); // 사용자의 기본 프로필 정보 (닉네임, 학과, 프로필 이미지 등)

  // `baekjoonProfile` 상태: 백준 프로필 정보 (아이디, 티어, 랭킹, 상위 백분율)
  const [baekjoonProfile, setBaekjoonProfile] = useState({
    handle: '',
    tier: null,
    ratingRank: null,
    rankpercentile: null,
  });

  // ---


  // `isLoggedIn` 상태 변경 시 사용자의 카드 목록을 불러옴
  useEffect(() => {
    if (!isLoggedIn) return; // 로그인 상태가 아니면 실행하지 않음
    axios.get("http://localhost:4000/card/me", { withCredentials: true }) // 사용자 카드 정보 요청
      .then(res => setCards(res.data)) // 성공 시 카드 목록 상태 업데이트
      .catch(err => console.error("카드 불러오기 실패:", err)); // 실패 시 에러 콘솔 출력
  }, [isLoggedIn]); // `isLoggedIn`이 변경될 때마다 실행

  // 컴포넌트 마운트 시 사용자의 기본 프로필 정보를 불러옴
  useEffect(() => {
    axios.get("http://localhost:4000/info/api/basicprofile", { withCredentials: true }) // 기본 프로필 정보 요청
      .then(res => {
        setBasicInfo(res.data); // 성공 시 기본 프로필 정보 상태 업데이트
        setIsLoggedIn(true); // 로그인 상태를 true로 설정
      })
      .catch(err => {
        console.error("기본 프로필 불러오기 실패:", err); // 실패 시 에러 콘솔 출력
        setIsLoggedIn(false); // 로그인 상태를 false로 설정
        setBasicInfo(null); // 기본 프로필 정보 초기화
      });
  }, []); // 컴포넌트가 처음 마운트될 때 한 번만 실행

  /* // `isLoggedIn` 상태 변경 시 백준 프로필 정보를 불러옴
  useEffect(() => {
    if (!isLoggedIn) return; // 로그인 상태가 아니면 실행하지 않음
    const fetchBaekjoonProfile = async () => {
      try {
        const res = await axios.get('http://localhost:4000/info/api/mypage', { withCredentials: true }); // 백준 프로필 정보 요청
        const { baekjoonName, tier, rankpercentile, rank } = res.data;
        // 백준 프로필 정보 상태 업데이트
        setBaekjoonProfile({ handle: baekjoonName, tier, ratingRank: rank, rankpercentile });
      } catch (err) {
        console.error('백준 정보 불러오기 실패:', err); // 실패 시 에러 콘솔 출력
      }
    };
    fetchBaekjoonProfile(); // 백준 프로필 정보 불러오는 함수 호출
  }, [isLoggedIn]); // `isLoggedIn`이 변경될 때마다 실행

  // 컴포넌트 마운트 시 오늘의 문제 정보를 불러옴
  useEffect(() => {
    axios.get('http://localhost:4000/dayquest/problem', { withCredentials: true }) // 오늘의 문제 정보 요청
      .then(res => {
        const { todayProblemId, todayProblemTitle } = res.data;
        // 오늘의 문제 정보 상태 업데이트
        setTodayProblem({ problemId: todayProblemId, title: todayProblemTitle });
      })
      .catch(err => {
        console.error('오늘의 문제 불러오기 실패:', err); // 실패 시 에러 콘솔 출력
      });
  }, []); // 컴포넌트가 처음 마운트될 때 한 번만 실행
*/

  // `isLoggedIn` 상태 변경 시 자유 게시판의 최신 게시글 3개를 불러옴
  useEffect(() => {
    axios.get("http://localhost:4000/posts", { withCredentials: true }) // 게시글 목록 요청
      .then(res => setPosts(res.data.slice(0, 3))) // 최신 3개 게시글로 상태 업데이트
      .catch(err => console.error("게시글 불러오기 실패:", err)); // 실패 시 에러 콘솔 출력
  }, [isLoggedIn]); // `isLoggedIn`이 변경될 때마다 실행

  // ---

  // 네비게이션 버튼 스타일 정의
  const navBtnStyle = {
    backgroundColor: "transparent",
    border: "none",
    color: "#b3e5fc",
    fontWeight: "normal",
    fontSize: "15px",
    cursor: "pointer",
    padding: "4px 8px"
  };

  // 새 카드 모달을 닫는 함수
  const closeCardModal = () => setShowCardModal(false);

  // ---




  useEffect(() => {
  setTodayProblem({
    problemId: 1000,
    title: "테스트 문제 - A + B"
  });
}, []);
  if (!todayProblem) return <div>로딩 중...</div>;

  // 메인 컴포넌트 렌더링
  return (
    <div style={{ backgroundColor: "#0d1117", color: "#e0f7fa", minHeight: "100vh" }}>
      {/* ⭐ 배경 별 이미지들 */}
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
      
      <img src="/public/배경/star1.png" className="twinkle" style={{ position: "absolute", top: "5vh", left: "10vw", width: "26px", zIndex: 0 }} alt="star1" />
      <img src="/public/배경/star1.png" className="twinkle" style={{ position: "absolute", top: "12vh", left: "45vw", width: "30px", zIndex: 0 }} alt="star1" />
      <img src="/public/배경/star1.png" className="twinkle" style={{ position: "absolute", top: "20vh", left: "70vw", width: "24px", zIndex: 0 }} alt="star1" />
      <img src="/public/배경/star1.png" className="twinkle" style={{ position: "absolute", top: "33vh", left: "10vw", width: "22px", zIndex: 0 }} alt="star1" />
      <img src="/public/배경/star1.png" className="twinkle" style={{ position: "absolute", top: "40vh", left: "60vw", width: "28px", zIndex: 0 }} alt="star1" />
      <img src="/public/배경/star1.png" className="twinkle" style={{ position: "absolute", top: "55vh", left: "20vw", width: "26px", zIndex: 0 }} alt="star1" />
      <img src="/public/배경/star1.png" className="twinkle" style={{ position: "absolute", top: "68vh", left: "50vw", width: "25px", zIndex: 0 }} alt="star1" />
      <img src="/public/배경/star1.png" className="twinkle" style={{ position: "absolute", top: "75vh", left: "80vw", width: "29px", zIndex: 0 }} alt="star1" />
      <img src="/public/배경/star1.png" className="twinkle" style={{ position: "absolute", top: "82vh", left: "25vw", width: "21px", zIndex: 0 }} alt="star1" />
      <img src="/public/배경/star1.png" className="twinkle" style={{ position: "absolute", top: "93vh", left: "40vw", width: "23px", zIndex: 0 }} alt="star1" />


      {/* 헤더 섹션 */}
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
        {/* 로고 */}
        <div style={{ fontSize: "22px", textShadow: "0 0 8px #00e5ff" }}>SEJONG-Universe</div>
        {/* 네비게이션 버튼들 */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <button onClick={() => navigate("/ranking")} style={navBtnStyle}>랭킹</button>
          <button onClick={() => navigate("/dayquest")} style={navBtnStyle}>일일퀘스트</button>
          <button onClick={() => navigate("/community")} style={navBtnStyle}>자유게시판</button>
          <button onClick={() => navigate("/mypage")} style={navBtnStyle}>마이페이지</button>
          {/* 로그인 상태에 따라 로그아웃 또는 로그인 버튼 표시 */}
          {isLoggedIn ? (
            <button onClick={async () => {
              try {
                await axios.get("http://localhost:4000/user/logout", { withCredentials: true }); // 로그아웃 요청
                setIsLoggedIn(false); // 로그인 상태 false로 변경
                setBasicInfo(null); // 기본 정보 초기화
                window.location.href = "/"; // 홈으로 리디렉션
              } catch (err) {
                console.error("로그아웃 실패:", err); // 로그아웃 실패 시 에러 콘솔 출력
              }
            }} style={navBtnStyle}>로그아웃</button>
          ) : (
            <button onClick={() => navigate("/login")} style={navBtnStyle}>로그인</button>
          )}
          {/* 홈으로 이동 버튼 */}
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

      {/* 출석 및 카드 앨범 섹션 */}
      <div style={{ display: "flex", gap: "20px", marginTop: "50px", paddingLeft: "40px" }}>
        <AttendanceAndCardAlbum />{/* 발자국 오른쪽에 우주 외계인 이미지 */}
        <div
  style={{
    position: "absolute",
    top: "180px",
    left: "680px",
    width: "90px",
    height: "90px",
    borderRadius: "50%",
    backgroundColor: "#0d1117", // 배경색이랑 동일하게
    boxShadow: "0 0 30px 10px #ffeecc", // ✨ 황토빛 그림자 효과
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
     backgroundColor: "transparent", // 배경 제거
  }}
>
  <img
  src="/public/배경/달.png"
  alt="moon"
  style={{
    width: "90px",
    height: "90px",
    borderRadius: "50%", // 둥글게 자르기
    backgroundColor: "transparent",
    filter: "drop-shadow(0 0 12px #ffdd99)",
    boxShadow: "0 0 25px 4px #ffdd99", // 살짝 노란빛 외곽 테두리
    transition: "filter 0.2s ease, box-shadow 0.3s ease",
  }}
/>

    </div>
              <img
            src="/public/배경/우주인.png" 
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

           <img
            src="/public/배경/지구.png" 
            alt="floating-astronaut"
            style={{
              position: "absolute",
             top: "100px",
              right: "100px",
              width: "140px",
              animation: "float-spin2 6s ease-in-out infinite",
            zIndex: 1,
            filter: "drop-shadow(0 0 6px white)",
           }}
          />
      </div>

      {/* 프로필 및 주요 정보 섹션 */}
      <div style={{ padding: "40px", marginTop: "30px" }}>
        <div style={{ display: "flex", gap: "20px", alignItems: "flex-start", marginBottom: "40px" }}>
          {/* 백준 프로필 컴포넌트 (클릭 시 랭킹 페이지로 이동) */}
          <div onClick={() => navigate("/ranking")} style={{ cursor: "pointer" }}>
            <BaekjoonProfile {...baekjoonProfile} />
          </div>
          {/* 내 프로필 또는 로그인 창 컴포넌트 (로그인 상태에 따라 다르게 표시) */}
          <LoginWindow />
        </div>

        {/* 퀘스트, 게시판, 카드 앨범 섹션 */}
        <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
          {/* 퀘스트 캡슐 컴포넌트 및 외계인 이미지 */}
          <div style={{ position: "relative" }}>
            <QuestCapsule problem={todayProblem} />
            {/* 외계인 이미지는 장식용 */}
            <img src="/public/배경/에일리언.png" className="alien alien1" alt="alien1" />
            <img src="/public/배경/에일리언.png" className="alien alien2" alt="alien2" />
            <img src="/public/배경/에일리언.png" className="alien alien3" alt="alien3" />
          </div>
          {/* 자유 게시판 미리보기 컴포넌트 */}
          <FreeBoardPreview posts={posts} isLoggedIn={isLoggedIn} />
          {/* 카드 앨범 컴포넌트 */}
          <CardAlbum cards={cards} />
        </div>
      </div>

      {/* 새 카드 획득 모달 (showCardModal이 true이고 newCard가 있을 때만 표시) */}
      {showCardModal && newCard && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0, 0, 0, 0.8)", // 반투명 검정 배경
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 2000 // 다른 요소 위에 표시
        }}>
          <div style={{
            position: "relative",
            backgroundColor: "#121826", // 모달 배경색
            padding: "20px",
            borderRadius: "20px",
            width: "400px",
            textAlign: "center",
            boxShadow: "0 0 20px #00e5ff", // 네온 효과 그림자
            animation: "neon-flicker 1.5s infinite alternate" // 네온 깜빡임 애니메이션
          }}>
            {/* 모달 닫기 버튼 */}
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
            {/* 새 카드 획득 메시지 */}
            <h2 style={{ color: "#00e5ff", marginBottom: "12px" }}>🎉 새로운 카드 획득!</h2>
            {/* 획득한 카드 이미지 */}
            <img src={newCard.image} alt={newCard.title} style={{ width: "100%", borderRadius: "12px", boxShadow: "0 0 10px #00e5ff" }} />
            {/* 카드 코멘트 */}
            <p style={{ marginTop: "12px", color: "#e0f7fa" }}>{newCard.comment}</p>
          </div>
        </div>
      )}
    </div>

  );
}
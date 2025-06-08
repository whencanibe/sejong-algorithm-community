import React, { useEffect, useState } from "react";
import axios from "axios";
import CardAlbum from "./CardAlbum"; // 카드 보관함 컴포넌트

export default function AttendanceAndCardAlbum({ isLoggedIn = false  }) {
  // 발자국(출석 상태), 카드 목록 등 주요 상태 정의
  const [footprints, setFootprints] = useState([]);
  const [cards, setCards] = useState([]);
  const [rewardGiven, setRewardGiven] = useState(() => {
    return localStorage.getItem("rewardGiven") === "true";
  });
  const [newCard, setNewCard] = useState(null);
  const [showCardModal, setShowCardModal] = useState(false);
  const [consecutiveDays, setConsecutiveDays] = useState(0);

  // 유저 streak(연속 출석 일수) 정보 불러오기
  useEffect(() => {
    axios.get("http://localhost:4000/info/api/mypage", { withCredentials: true })
      .then(res => {
        if (res.data?.streak != null) {
          console.log("✅ streak 값:", res.data.streak);
          setConsecutiveDays(res.data.streak);
        }
      })
      .catch(err => {
        console.error("연속 출석 정보 불러오기 실패:", err);
      });
  }, []);

  // 발자국(출석 기록) 불러오기
  useEffect(() => {
    axios.get("http://localhost:4000/info/api/footprints", { withCredentials: true })
      .then(res => {
        const data = res.data;
        console.log("서버 응답:", data);

        if (Array.isArray(data)) setFootprints(data);
        else if (Array.isArray(data.footprints)) setFootprints(data.footprints);
        else console.error("올바르지 않은 응답 형식:", data);
      })
      .catch(err => {
        console.error("발자국 불러오기 실패:", err);
      });
  }, []);

  // 유저가 소유한 카드 목록 불러오기
  useEffect(() => {
    axios.get("http://localhost:4000/card/me", { withCredentials: true })
      .then(res => setCards(res.data))
      .catch(err => console.error("카드 불러오기 실패:", err));
  }, []);

  // 도장 7개 찍었을 때 카드 자동 지급 로직
  useEffect(() => {
    const stampCount = footprints.filter(f => f).length;

    if (stampCount === 7 && !rewardGiven) {
      axios.post("http://localhost:4000/card/reward", { stampCount: 7 }, { withCredentials: true })
        .then(res => {
          if (!res.data.card) return;

          const newCard = res.data.card;
          setCards(prev => [newCard, ...prev]);
          setNewCard(newCard);
          setShowCardModal(true);
          setRewardGiven(true);
          localStorage.setItem("rewardGiven", "true");
        })
        .catch(err => {
          const msg = err.response?.data?.message || err.message;
          console.warn("카드 지급 실패:", msg);
        });
    }
  }, [footprints, rewardGiven]);

 const displayedFootprints = !isLoggedIn ? Array(7).fill(true) : footprints;


  // 카드 모달 닫기
  const closeCardModal = () => setShowCardModal(false);

  return (
    <div style={{ display: "flex", gap: "40px", margin: "80px 40px" }}>
      
      {/* 로그인 상태일 때만 연속 출석 텍스트 표시 */}
      {isLoggedIn &&  (
        <div className="attendance-streak">
          연속 {consecutiveDays}일차 출석 성공 !!
        </div>
      )}

      {/*  발자국 이미지 + 요일 텍스트 */}
      <div style={{ display: "flex", gap: "20px", marginLeft :"-30px" }}>
        {displayedFootprints.map((filled, i) => {
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  return (
    <div key={i} style={{ textAlign: "center" }}>
      <img
        src="/발자국.png"
        alt={`footprint-${i}`}
        style={{
          width: "80px",
          height: "80px",
          cursor: "default",
          transition: "0.2s",
          zIndex: 10,
          position: "relative",
          transform: `rotate(${i % 2 === 0 ? "-270deg" : "120deg"}) scaleX(${i % 2 === 0 ? 1 : -1})`,
          filter: filled
            ? "brightness(1.2) drop-shadow(0 0 8px #4dabf7)"
            : "grayscale(70%) opacity(0.8)",
        }}
      />
      <div style={{ marginTop: "5px", fontSize: "18px", color: "#00e5ff" }}>
        {days[i]}
      </div>
    </div>
  );
})}

      </div>

      {/*  카드 보상 모달 */}
      {showCardModal && newCard && (
        <div
          style={{
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
          }}
        >
          <div
            style={{
              position: "relative",
              backgroundColor: "#121826",
              padding: "20px",
              borderRadius: "20px",
              width: "300px",
              textAlign: "center",
              boxShadow: "0 0 20px #00e5ff",
              animation: "neon-flicker 1.5s infinite alternate",
            }}
          >
            {/* x 닫기 버튼 */}
            <button
              onClick={closeCardModal}
              style={{
                position: "absolute",
                top: "-15px",
                right: "-15px",
                background: "#00e5ff",
                border: "none",
                borderRadius: "50%",
                color: "#121826",
                fontWeight: "bold",
                fontSize: "16px",
                cursor: "pointer",
                width: "32px",
                height: "32px",
                boxShadow: "0 0 8px #00e5ff",
                zIndex: 10,
              }}
            >
              ✕
            </button>

            {/* 카드 정보 */}
            <h2 style={{ color: "#00e5ff", marginBottom: "12px" }}>
              새로운 카드 획득!
            </h2>

            <img
              src={newCard.image}
              alt={newCard.title}
              style={{
                width: "100%",
                borderRadius: "12px",
                boxShadow: "0 0 10px #00e5ff",
              }}
            />

            <p style={{ marginTop: "12px", color: "#e0f7fa" }}>
              {newCard.comment}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

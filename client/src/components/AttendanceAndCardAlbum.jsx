import React, { useEffect, useState } from "react";
import axios from "axios";
import CardAlbum from "./CardAlbum";

export default function AttendanceAndCardAlbum() {
  const [footprints, setFootprints] = useState([]);
  const [cards, setCards] = useState([]);
  const [rewardGiven, setRewardGiven] = useState(() => {
  return localStorage.getItem("rewardGiven") === "ture";
});

  const [newCard, setNewCard] = useState(null);
  const [showCardModal, setShowCardModal] = useState(false);

//   useEffect(() => {
//   axios.get("http://localhost:4000/info/api/footprints", { withCredentials: true })
//     .then(res => {
//       const { footprints } = res.data;
//       if (Array.isArray(footprints)) {
//         setFootprints(footprints);
//       } else {
//         console.error("footprints가 배열이 아님:", footprints);
//         setFootprints([]);
//       }
//     })
//     .catch(err => {
//       console.error("발자국 불러오기 실패:", err);
//     });
// }, []);


  useEffect(() => {
  axios.get("http://localhost:4000/info/api/footprints", { withCredentials: true })
    .then(res => {
      const data = res.data;
      console.log("서버 응답 데이터:", data);
      if (Array.isArray(data)) {
        setFootprints(data);
      } else if (Array.isArray(data.footprints)) {
        setFootprints(data.footprints);
      } else {
        console.error("응답 데이터 형식이 올바르지 않습니다:", data);
      }
    })
    .catch(err => {
      console.error("발자국 불러오기 실패:", err);
    });
}, []);


   useEffect(() => {
    axios.get("http://localhost:4000/card/me", { withCredentials: true })
      .then(res => setCards(res.data))
      .catch(err => console.error("카드 불러오기 실패:", err));
  }, []);



  useEffect(() => {
  const stampCount = 7; // 강제로 도장 7개 있다고 설정

  //const stampCount = footprints.filter(f => f).length;

  // 도장 7개 + 아직 카드 못 받았을 때만 지급 요청
  if (stampCount === 7 && !rewardGiven) {
    axios.post("http://localhost:4000/card/reward", {
      stampCount: 7,
    }, {
      withCredentials: true,
    })
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

  const closeCardModal = () => setShowCardModal(false);

  return (
    <div style={{ display: "flex", gap: "40px", margin: "60px 40px" }}>
      {/* 발자국 UI */}
      <div style={{ display: "flex", gap: "10px" }}>
        {footprints.map((filled, i) => (
          <img
            key={i}
            src="/발자국.png"
            alt={`footprint-${i}`}
            style={{
              width: "70px",
              height: "70px",
              cursor: "default",
              transition: "0.2s",
              transform: `rotate(${i % 2 === 0 ? "-270deg" : "120deg"}) scaleX(${i % 2 === 0 ? 1 : -1})`,
              filter: filled
                ? "brightness(1.2) drop-shadow(0 0 8px #4dabf7)"
                : "grayscale(70%) opacity(0.8)",
            }}
          />
        ))}
      </div>


      {/* 카드 모달 */}
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
            <button
  onClick={closeCardModal}
  style={{
    position: "absolute",
    top: "-15px",
    right: "-15px",
    background: "#00e5ff", // 네온 블루
    border: "none",
    borderRadius: "50%",
    color: "#121826",       // 어두운 배경에 대비되는 글자색
    fontWeight: "bold",
    fontSize: "16px",
    cursor: "pointer",
    width: "32px",
    height: "32px",
    boxShadow: "0 0 8px #00e5ff",  // 네온 블루 그림자
    zIndex: 10,
  }}
>
  ✕
</button>


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
            <p style={{ marginTop: "12px", color: "#e0f7fa" }}>{newCard.comment}</p>
          </div>
        </div>
      )}
    </div>
  );
}

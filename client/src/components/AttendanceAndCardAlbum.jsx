import React, { useEffect, useState } from "react";
import axios from "axios";
import CardAlbum from "./CardAlbum";

export default function AttendanceAndCardAlbum() {
  const [footprints, setFootprints] = useState([]);
  const [cards, setCards] = useState([]);
  const [rewardGiven, setRewardGiven] = useState(false);
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
        setFootprints(res.data); // 예: [1, 1, 1, 1, 1, 1, 1]
      })
      .catch(err => {
        console.error("발자국 불러오기 실패:", err);
      });
  }, []);


   useEffect(() => {
    axios.get("http://localhost:4000/card", { withCredentials: true })
      .then(res => setCards(res.data))
      .catch(err => console.error("카드 불러오기 실패:", err));
  }, []);

   useEffect(() => {
  const allChecked = true;  // 그냥 무조건 true로
  if (allChecked && !rewardGiven) {
    axios.post("http://localhost:4000/card/reward", {
      stampCount: 7  // 강제로 7개 도장 있다고 가정
    }, {
      withCredentials: true
    })
      .then(res => {
        if (!res.data.card) return; //카드가 안 오면 리턴
        const newCard = res.data.card;
        setCards(prev => [newCard, ...prev]);
        setNewCard(newCard);  // 모달용
        setShowCardModal(true);
        setRewardGiven(true);
      })
      .catch(err => {
        const msg = err.response?.data?.message || err.message;
        alert(msg); // ← 예: "오늘은 이미 카드를 받았습니다."
      });
  }
}, []);



  // ✅ 도장 7개면 카드 지급
  useEffect(() => {
     console.log("카드첩에 받은 카드 목록:", cards); // ✅ 여기에만 딱 한 번 찍히게
    const stampCount = footprints.filter((f) => f).length;
    if (stampCount === 7 && !rewardGiven) {
      axios
        .post(
          "http://localhost:4000/card/reward",
          { stampCount: 7 },
          { withCredentials: true }
          
        )
        .then((res) => {
          const newCard = res.data.card;
          setCards((prev) => [newCard, ...prev]);
          setNewCard(newCard);
          setShowCardModal(true);
          setRewardGiven(true);
        })
        .catch((err) => {
          console.warn(
            "카드 지급 실패:",
            err.response?.data?.error || err.message
          );
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
              width: "60px",
              height: "60px",
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
                zIndex: 10,
              }}
            >
              ✕
            </button>
            <h2 style={{ color: "#00e5ff", marginBottom: "12px" }}>
              🎉 새로운 카드 획득!
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

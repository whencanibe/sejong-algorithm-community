import React, { useEffect, useState } from "react";
import CardAlbum from "../components/CardAlbum";

export default function AttendanceAndCardAlbum() {
   const [footprints, setFootprints] = useState([]);
  const [cards, setCards] = useState([]);
  const [rewardGiven, setRewardGiven] = useState(false);

  // ✅ footprints 불러오기 (서버)
  useEffect(() => {
    axios.get("http://localhost:4000/footprints", { withCredentials: true })
      .then(res => {
        setFootprints(res.data); // 예: [1, 1, 1, 1, 1, 1, 1]
      })
      .catch(err => {
        console.error("발자국 불러오기 실패:", err);
      });
  }, []);


   useEffect(() => {
    axios.get("http://localhost:4000/cards", { withCredentials: true })
      .then(res => setCards(res.data))
      .catch(err => console.error("카드 불러오기 실패:", err));
  }, []);

   // ✅ 출석 7개 완료 → 카드 요청
  useEffect(() => {
    const allSeven = footprints.length === 7 && footprints.every(v => v === 1 || v === true);
    if (allSeven && !rewardGiven) {
      axios.post("http://localhost:4000/cards/reward", {}, { withCredentials: true })
        .then(res => {
          const newCard = res.data.card;
          setCards(prev => [newCard, ...prev]);
          setRewardGiven(true);
        })
        .catch(err => {
          console.warn("카드 지급 실패:", err.response?.data?.error || err.message);
        });
    }
  }, [footprints, rewardGiven]);

  
  

  return (
    <div style={{ display: "flex", gap: "40px", margin: "60px 40px" }}>
      {/* 발자국 UI */}
      <div style={{ display: "flex", gap: "10px" }}>
        {footprints.map((filled, i) => (
          <img
            key={i}
            src="/발자국.png"
            alt={`footprint-${i}`}
            onClick={() => handleFootprintClick(i)}
            style={{
              width: "60px",
              height: "60px",
              cursor: "pointer",
              transition: "0.2s",
              transform: `rotate(${i % 2 === 0 ? "-270deg" : "120deg"}) scaleX(${i % 2 === 0 ? 1 : -1})`,
              filter: filled
                ? "brightness(1.2) drop-shadow(0 0 8px #4dabf7)"
                : "grayscale(70%) opacity(0.8)",
            }}
          />
        ))}
      </div>

      {/* 카드첩 */}
      <CardAlbum cards={cards} />
    </div>
  );
}

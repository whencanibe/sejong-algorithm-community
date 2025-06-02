import React, { useEffect, useState } from "react";
import CardAlbum from "../components/CardAlbum";

export default function AttendanceAndCardAlbum() {
   const [footprints, setFootprints] = useState([]);
  const [cards, setCards] = useState([]);
  const [rewardGiven, setRewardGiven] = useState(false);

  // ✅ footprints 불러오기 (서버)
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

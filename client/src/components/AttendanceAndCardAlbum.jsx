import React, { useEffect, useState } from "react";
import CardAlbum from "../components/CardAlbum";

export default function AttendanceAndCardAlbum() {
  const [footprints, setFootprints] = useState(() => {
    const saved = localStorage.getItem("footprints");
    return saved ? JSON.parse(saved) : Array(6).fill(false);
  });

  const [cards, setCards] = useState(() => {
    const saved = localStorage.getItem("cards");
    return saved ? JSON.parse(saved) : [];
  });

  const [rewardGiven, setRewardGiven] = useState(() => {
    return localStorage.getItem("rewardGiven") === "true";
  });

  // 수동 발자국 클릭
  const handleFootprintClick = (index) => {
    const updated = [...footprints];
    updated[index] = true;
    setFootprints(updated);
    localStorage.setItem("footprints", JSON.stringify(updated));
  };

  // 출석 완료 시 카드 지급
  useEffect(() => {
    const allChecked = footprints.every(Boolean);
    if (allChecked && !rewardGiven) {
      const newCard = {
        title: "꾸준 카드",
        date: new Date().toISOString().split("T")[0],
        image: "/꾸준.png"
      };
      const updatedCards = [newCard, ...cards];
      setCards(updatedCards);
      setRewardGiven(true);
      localStorage.setItem("cards", JSON.stringify(updatedCards));
      localStorage.setItem("rewardGiven", "true");
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

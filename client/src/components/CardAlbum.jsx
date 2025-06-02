import React from "react";

export default function CardAlbum({ cards }) {
  console.log("🃏 카드첩에 받은 카드 목록:", cards);

  return (
    <div
      style={{
        width: "320px",
        height: "360px",
        border: "2px solid #00e5ff",
        borderRadius: "16px",
        backgroundColor: "#1a1e2a",
        color: "#e0f7fa",
        padding: "20px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
        marginTop: "40px",
        boxShadow: "0 0 18px rgba(0, 229, 255, 0.3)",
      }}
    >
      {/* 제목 */}
      <h3 style={{ margin: "0 0 16px", fontSize: "18px", color: "#00e5ff" }}>🗂 카드첩</h3>

      {/* 카드 리스트 */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {(!cards || cards.length === 0) && (
          <div style={{ fontSize: "14px", color: "#aaa" }}>아직 카드가 없습니다.</div>
        )}

        {cards?.filter(Boolean).map((card, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              backgroundColor: "#2c3442",
              border: "1px solid #4dabf7",
              borderRadius: "10px",
              padding: "10px",
              boxShadow: "0 1px 5px rgba(0,0,0,0.1)",
            }}
          >
            <img
              src={card.image}
              alt={card.title}
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "6px",
                objectFit: "cover",
                boxShadow: "0 0 5px #00e5ff",
              }}
            />
            <div>
              <div style={{ fontWeight: "bold", fontSize: "15px", color: "#00e5ff" }}>
                {card.title}
              </div>
              <div style={{ fontSize: "12px", color: "#bbb" }}>
                {card.createdAt
                  ? new Date(card.createdAt).toLocaleDateString()
                  : "날짜 없음"}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

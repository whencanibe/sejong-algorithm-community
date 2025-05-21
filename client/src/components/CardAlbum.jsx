import React from "react";

// cards prop: [{ title, date, image }]
export default function CardAlbum({ cards }) {
  return (
    <div
      style={{
        width: "260px",
        height: "250px",
        border: "2px solid #3f3fff",
        borderRadius: "10px",
        backgroundColor: "#f7f9ff",
        padding: "16px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
        marginTop:"50px",
        boxShadow: "0 4px 10px rgba(63, 63, 255, 0.1)",
      }}
    >
      {/* 제목 */}
      <h3 style={{ margin: "0 0 12px 0", fontSize: "16px", color: "#3f3fff" }}>🗂 카드첩</h3>

      {/* 카드 리스트 */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {cards.length === 0 && (
          <div style={{ fontSize: "14px", color: "#888" }}>아직 카드가 없습니다.</div>
        )}

        {cards.map((card, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              backgroundColor: "white",
              border: "1px solid #d0d0ff",
              borderRadius: "8px",
              padding: "8px",
              boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
            }}
          >
            <img
              src={card.image}
              alt={card.title}
              style={{ width: "48px", height: "48px", borderRadius: "6px" }}
            />
            <div>
              <div style={{ fontWeight: "bold", fontSize: "14px", color: "#3f3fff" }}>
                {card.title}
              </div>
              <div style={{ fontSize: "12px", color: "#666" }}>{card.date}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


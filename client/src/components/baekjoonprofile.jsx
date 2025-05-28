import React from "react";

export default function BaekjoonProfile({ handle, tier, ratingRank }) {
  return (
    <div
      style={{
        width: "850px",
        height: "300px",
         display: "flex",
        gap: "24px",
        padding: "24px 32px",
         backgroundColor: "#2a3142", // 밝은 다크 블루
    borderRadius: "12px",
    padding: "20px",
    border: "1px solid #00e5ff",
    boxShadow: "0 0 12px rgba(0, 229, 255, 0.25)",
    color: "#e0f7fa"
      }}
    >
      {/* 왼쪽: 티어 이미지 */}
      <div
        style={{
          width: "120px",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          src='\등급\다이아1.png'
          alt="백준 티어"
          style={{ width: "100px", height: "100px" }}
        />
      </div>

      {/* 오른쪽: 닉네임 + 그래프 */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
        }}
      >
        {/* 닉네임 */}
        <div style={{ marginBottom: "8px" }}>
          <h3 style={{ margin: 0, fontSize: "16px" }}>
            닉네임: <span style={{ color: "#3f3fff" }}>{handle}</span>
          </h3>
          <p style={{ margin: 0, fontSize: "13px", color: "#666" }}>
            상위 약 {ratingRank}위
          </p>
        </div>

        {/* 그래프 박스 */}
        <div
          style={{
            flex: 1,
            border: "2px solid #3f3fff",
            borderRadius: "10px",
            backgroundColor: "white",
            padding: "16px",
            fontSize: "15px",
            fontWeight: "bold",
            color: "#3f3fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 6px rgba(63, 63, 255, 0.05)",
          }}
        >
          그래프 영역
        </div>
      </div>
    </div>
  );
}

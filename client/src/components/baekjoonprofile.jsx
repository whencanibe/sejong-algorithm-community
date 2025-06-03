import React from "react";

export default function BaekjoonProfile({ handle, tier, ratingRank }) {
  
  const convertTierToImagePath = (tierString) => {
  if (!tierString) return '/등급/default.png';

  // "실버 III" → ["실버", "III"]
  const parts = tierString.split(" ");
  if (parts.length !== 2) return '/등급/default.png';

  const korTier = parts[0];           // 예: "실버"
  const roman = parts[1];             // 예: "III"

  // 로마 숫자 → 아라비아 숫자 매핑
  const romanToNumber = {
    I: 1,
    II: 2,
    III: 3,
    IV: 4,
    V: 5,
  };

  const level = romanToNumber[roman];
  if (!level) return '/등급/default.png';

  return `/등급/${korTier}${level}.png`;  // 예: "/등급/실버3.png"
};


  const tierImgPath = convertTierToImagePath(tier);

  return (
    <div
      style={{
        width: "850px",
        height: "300px",
        display: "flex",
        gap: "24px",
        padding: "24px 32px",
         backgroundColor: "#1a1e2a",
        borderRadius: "12px",
        border: "2px solid #00e5ff",
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
        <img src={tierImgPath} alt="백준 티어" style={{ width: "100px", height: "100px" }} />
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
        {/* 닉네임, 티어, 랭크 */}
        <div style={{ marginBottom: "8px" }}>
          <h3 style={{ margin: 0, fontSize: "20px", color: "#afefff" }}>
            백준ID: <span style={{  color: "#00e5ff" }}>{handle}</span>
          </h3>
          <p style={{ margin: 0, fontSize: "16px", color: "#afefff"}}>
            티어: {tier} / 세종대 내 랭킹 {ratingRank}위
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

import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Cell
} from "recharts";

export default function BaekjoonProfile({ handle, tier, ratingRank, rankingData,nickname }) {

  // 티어 이미지 경로 변환 함수
  const convertTierToImagePath = (tierString) => {
    if (!tierString) return '/등급/default.png';

    const parts = tierString.split(" ");
    if (parts.length !== 2) return '/등급/default.png';

    const korTier = parts[0];
    const roman = parts[1];

    const romanToNumber = {
      I: 1,
      II: 2,
      III: 3,
      IV: 4,
      V: 5,
    };

    const level = romanToNumber[roman];
    if (!level) return '/등급/default.png';

    return `/등급/${korTier}${level}.png`;
  };

  const tierImgPath = convertTierToImagePath(tier);
  const myName = handle;

  // 랭킹 데이터 → 그래프용 데이터 변환
  const data = Array.isArray(rankingData)
    ? rankingData.map(user => ({
        name: user.name,
        solved: user.solvedNum
      }))
    : [];



  return (
    <div
      style={{
        width: "800px",
        height: "300px",
        display: "flex",
        gap: "24px",
        padding: "24px 32px",
        backgroundColor: "#1a1e2a",
        borderRadius: "12px",
        border: "2px solid #00e5ff",
        boxShadow: "0 0 12px rgba(0, 229, 255, 0.25)",
        color: "#e0f7fa",
        zIndex: 10,
        position: 'relative',
        marginRight:"30px",
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

      {/* 오른쪽: 닉네임 및 그래프 */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
        }}
      >
        {/* 닉네임/랭크 정보 */}
        <div style={{ marginBottom: "8px" }}>
          <h3 style={{ margin: 0, fontSize: "20px", color: "#afefff" }}>
            백준ID: <span style={{ color: "#00e5ff" }}>{handle}</span>
          </h3>
          <p style={{ margin: 0, fontSize: "16px", color: "#afefff" }}>
            티어: {tier} / 세종대 내 랭킹 {ratingRank}위
          </p>
        </div>



        {/* 막대 그래프 */}
<div
  style={{
    flex: 1,
     border: "2px solid #00e5ff",
    borderRadius: "10px",
    backgroundColor: "black",
    padding: "16px",
    fontSize: "14px",
    fontWeight: "bold",
    color: "e0f7fa",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 2px 6px rgba(63, 63, 255, 0.05)",
    boxSizing: "border-box",
  }}
>
  {data.length > 0 ? (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 10, right: 30, left: 30, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis dataKey="name" type="category"  tick={{
        fill: "#e0f7fa",
        boxShadow: "0 2px 6px rgba(63, 63, 255, 0.05)",
        }} />
        <Tooltip />
        <Legend />
        <Bar dataKey="solved" name="풀이 수">
          {data.map((entry, index) => {
            const isMe = entry.name === nickname;
            return (
              <Cell
                key={`cell-${index}`}
                fill={isMe ? "#00e5ff" : "#e0f7fa"}
                style={isMe ? { filter: "drop-shadow(0 0 6px #00e5ff)" } : {}}
              />
            );
          })}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  ) : (
    <img
      src="/웰컴.png"
      alt="Welcome"
      style={{
        maxWidth: "60%",
        objectFit: "contain",
      }}
    />
  )}
</div>

      </div>
    </div>
  );
}

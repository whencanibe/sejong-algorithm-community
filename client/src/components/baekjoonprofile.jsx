import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell
} from "recharts";

// 백준 프로필 컴포넌트
export default function BaekjoonProfile({ handle, tier, ratingRank, rankingData, nickname }) {

  //  티어 문자열을 티어 이미지 경로로 변환하는 함수
  const convertTierToImagePath = (tierString) => {
    if (!tierString) return '/등급/default.png'; // tier 정보가 없으면 기본 이미지

    const parts = tierString.split(" ");
    if (parts.length !== 2) return '/등급/default.png'; // 예: "Gold I" → ["Gold", "I"]

    const korTier = parts[0]; // Gold, Silver 등
    const roman = parts[1];   // I, II 등

    const romanToNumber = { I: 1, II: 2, III: 3, IV: 4, V: 5 }; // 로마 숫자 매핑
    const level = romanToNumber[roman];

    if (!level) return '/등급/default.png'; // 예외 처리

    return `/등급/${korTier}${level}.png`; // 예: "/등급/Gold1.png"
  };

  // 티어 이미지 경로 계산
  const tierImgPath = convertTierToImagePath(tier);

  // 랭킹 그래프용 데이터 정리
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
        marginRight: "30px",
        overflow: "hidden",
      }}
    >

      {/* 로그인 전일 때 웰컴 이미지 배경 */}
      {!handle && (
        <img
          src="/웰컴.png"
          alt="welcome"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: 10,
          }}
        />
      )}

      {/* 내용 섹션 */}
      <div style={{ display: "flex", flex: 1, zIndex: 1 }}>
        
        {/* 왼쪽: 티어 이미지 */}
        <div
          style={{
            width: "120px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img src={tierImgPath} alt="백준 티어" style={{ width: "100px", height: "100px" }} />
        </div>

        {/* 오른쪽: 유저 정보 + 랭킹 그래프 */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
          }}
        >

          {/* 닉네임, 티어, 랭킹 표시 */}
          <div style={{ marginBottom: "8px" }}>
            <h3 style={{ margin: 0, fontSize: "20px", color: "#afefff" }}>
              백준ID: <span style={{ color: "#00e5ff" }}>{handle}</span>
            </h3>
            <p style={{ margin: 0, fontSize: "16px", color: "#afefff" }}>
              티어: {tier} / 세종대 내 랭킹 {ratingRank}위
            </p>
          </div>

          {/* 랭킹 그래프 */}
          <div
            style={{
              flex: 1,
              border: "2px solid #00e5ff",
              borderRadius: "10px",
              backgroundColor: "black",
              padding: "16px",
              fontSize: "14px",
              fontWeight: "bold",
              color: "#e0f7fa",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 6px rgba(63, 63, 255, 0.05)",
              boxSizing: "border-box",
            }}
          >
            {data.length > 0 ? (
              // 그래프 그리기 (가로 막대 차트)
              <ResponsiveContainer width="100%" height={200}>
                <BarChart
                  data={data}
                  layout="vertical"
                  margin={{ top: 10, right: 30, left: 30, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis
                    dataKey="name"
                    type="category"
                    tick={{ fill: "#e0f7fa" }}
                  />
                  <Tooltip />
                  <Bar dataKey="solved" name="전체 총 문제 풀이 수">
                    {data.map((entry, index) => {
                      const isMe = entry.name === nickname;
                      return (
                        <Cell
                          key={`cell-${index}`}
                          fill={isMe ? "#00e5ff" : "#e0f7fa"} // 본인만 파란색
                        />
                      );
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              // 데이터 없을 때
              <p style={{ color: "#ccc" }}>그래프 영역</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

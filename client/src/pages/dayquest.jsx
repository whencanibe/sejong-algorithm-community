import { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell } from "recharts";
import "../App.css";

const COLORS = ["#00C49F", "#FF8042"];

function Dayquest({ userId, problemId }) {
  const [hasSolvedToday, setHasSolvedToday] = useState(false);
  const [todayProblemId, setTodayProblemId] = useState(null);
  const [chartData, setChartData] = useState([
    { name: "푼 학생 수", value: 0 },
    { name: "안 푼 학생 수", value: 0 },
  ]);
  const [solvedCount, setSolvedCount] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    axios
      .get("http://localhost:4000/dayquest/status", {
        withCredentials: true,
      })
      .then((res) => {
        const { todayProblemId, solvedCount, totalUsers } = res.data;
        setTodayProblemId(todayProblemId);
        setSolvedCount(solvedCount);
        setTotalUsers(totalUsers);
        setHasSolvedToday(hasSolvedToday);
        setChartData([
          { name: "푼 학생 수", value: solvedCount },
          { name: "안 푼 학생 수", value: totalUsers - solvedCount },
        ]);
      })
      .catch((err) => {
        console.error("오늘의 문제 가져오기 실패:", err);
      });
  }, []);

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",

      }}
    >
      {/* 상단바 */}
      <header
  style={{
    position: "fixed",             // ❗헤더를 완전 고정 위치로
    top: 0,
    left: 0,
    width: "100%",                 // ❗진짜로 화면 꽉 채움
    backgroundColor: "#2a3142",
    color: "#e0f7fa",
    padding: "18px 40px",
    fontSize: "18px",
    fontWeight: "bold",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxSizing: "border-box",
    borderBottom: "1px solid #00e5ff",
    boxShadow: "0 2px 8px rgba(0, 229, 255, 0.15)",
    animation: "neonFlicker 1.5s infinite alternate",
    zIndex: 1000                  // 다른 요소 위로 오게
  }}
>
  일일 퀘스트
  <button
    onClick={() => (window.location.href = "/home")}
    style={{
      padding: "8px 16px",
      fontSize: "14px",
      backgroundColor: "white",
      color: "#2a3142",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
    }}
  >
    홈으로
  </button>
</header>


      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 20px 40px",
          textAlign: "center",
          boxSizing: "border-box",
        }}
      >
        <img
          src="/오늘의문제.png"
          alt="오늘의 문제"
          style={{
            width: "350px",
            animation: "hueRotate 5s infinite linear",
            filter: "hue-rotate(0deg)",
            marginTop: "100px",
            marginBottom: "30px",
          }}
        />

        <p style={{ marginTop: "30px", fontSize: "18px" }}>
          &nbsp;
          {todayProblemId ? (
            <a
              href={`https://www.acmicpc.net/problem/${todayProblemId}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "#ffffff",
                fontWeight: "bold",
                textDecoration: "underline",
              }}
            >
              백준 {todayProblemId}번 문제 풀기
            </a>
          ) : (
            <span style={{ color: "white" }}>문제를 불러오는 중입니다...</span>
          )}
        </p>

        <a
          href="https://www.acmicpc.net/problemset"
          target="_blank"
          style={{
            display: "block",
            marginTop: "20px",
            textDecoration: "underline",
            color: "#ffffff",
            fontWeight: "bold",
          }}
        >
          사이트 바로가기
        </a>

        
        {/* 두 개 박스 */}
<div
  style={{
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    marginTop: "40px",
    gap: "20px",
  }}
>
  {/* 왼쪽 박스 */}
  <div
    style={{
      flex: "1 1 200px",
      maxWidth: "280px",
      height: "240px",
      backgroundColor: "#2a3142",
      border: "1px solid #00e5ff",
      borderRadius: "12px",
      boxShadow: "0 0 12px rgba(0, 229, 255, 0.25)",
      padding: "20px",
      cursor: "pointer",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      boxSizing: "border-box",
      color: "#e0f7fa",
    }}
  >
    <img
      src="/완료도장.png"
      alt="도장"
      style={{
        width: "60%",
        filter: hasSolvedToday ? "none" : "grayscale(100%)",
        transition: "filter 0.3s ease-in-out",
      }}
    />
    <p style={{ marginTop: "10px" }}>
      {hasSolvedToday ? "내가 완료함" : "아직 안 했음"}
    </p>
  </div>

  {/* 오른쪽 박스 */}
  <div
    style={{
      flex: "1 1 200px",
      maxWidth: "280px",
      height: "240px",
      backgroundColor: "#2a3142",
      border: "1px solid #00e5ff",
      borderRadius: "12px",
      boxShadow: "0 0 12px rgba(0, 229, 255, 0.25)",
      padding: "20px",
      boxSizing: "border-box",
      textAlign: "center",
      color: "#e0f7fa",
    }}
  >
    <h3 style={{ margin: 0 }}>현재 학생들의 완료</h3>
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "14px",
      }}
    >
      <PieChart width={160} height={160}>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={30}
          outerRadius={65}
          fill="#8884d8"
          paddingAngle={5}
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>
      </PieChart>
      <p style={{ marginTop: "10px", fontSize: "14px" }}>
        {solvedCount}명이 풀었습니다 <br /> (전체 {totalUsers}명 중)
      </p>
    </div>
  </div>
</div>

       
      </div>
    </div>
  );
}

export default Dayquest;

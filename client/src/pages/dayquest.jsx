import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell } from "recharts";
import "../App.css";

const COLORS = ["#00C49F", "#FF8042"];

function Dayquest({ userId, problemId }) {
  const navigate = useNavigate();
  const [status, setStatus] = useState(null);       
  const [loading, setLoading] = useState(true);      
  const [error, setError] = useState(null);         

  // 상태 정보 불러오기 함수
  const fetchStatus = async (path = "http://localhost:4000/dayquest/status") => {
    try {
      setError(null);
      const { data } = await axios.get(path, { withCredentials: true });
      setStatus(data);
    } catch (err) {
      console.error(err);
      setError("데이터를 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 세션 확인 및 상태 초기 불러오기
  useEffect(() => {
    const checkSession = async () => {
      try {
        await axios.post("http://localhost:4000/info/api/refresh", {}, { withCredentials: true });
        fetchStatus(); 
      } catch (err) {
        alert("로그인이 필요합니다.");
        navigate("/login");
      }
    };
    checkSession();
  }, [navigate]);


  // 동기화 버튼 클릭 시 호출
  const handleRefresh = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        "http://localhost:4000/dayquest/refresh",
        {},
        { withCredentials: true }
      );
      setStatus(data);
    } catch (err) {
      console.error(err);
      setError("동기화에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 로딩 상태 처리
  if (loading) return <p style={{ color: "#fff" }}>로딩 중…</p>;

  // 에러 상태 처리
  if (error) return (
    <div style={{ color: "#fff", textAlign: "center" }}>
      <p>{error}</p>
      <button onClick={() => fetchStatus()} style={{ marginTop: 12 }}>
        다시 시도
      </button>
    </div>
  );

  // 상태에서 필요한 값 추출
  const { todayProblemId, todayProblemTitle, solvedCount, totalUsers, hasSolvedToday } = status;

  // 차트 데이터 구성
  const chartData = [
    { name: "푼 학생 수", value: solvedCount },
    { name: "안 푼 학생 수", value: totalUsers - solvedCount }
  ];

  return (
    <div>
      {/* 고정 상단바 */}
      <header style={{
        position: "fixed", 
        top: 0, left: 0, 
        width: "100%",
        backgroundColor: "#0d1117", 
        color: "#afefff", 
        padding: "18px 40px",
        fontSize: "18px", 
        fontWeight: "bold", 
        display: "flex",
        justifyContent: "space-between", 
        alignItems: "center",
        borderBottom: "1px solid #00e5ff", 
        boxShadow: "0 2px 8px rgba(0, 229, 255, 0.15)",
        animation: "neonFlicker 1.5s infinite alternate", 
        zIndex: 1000
      }}>
        일일 퀘스트
        <button onClick={() => (window.location.href = "/")} style={{
          padding: "8px 16px", 
          backgroundColor: "#afefff", 
          color: "#0d1117",
          border: "none", 
          borderRadius: "4px", 
          cursor: "pointer", 
          fontWeight: "bold",
          boxShadow: "0 0 10px #00e5ff", 
          fontSize: "14px",
          marginRight:"60px",
        }}>홈으로</button>
      </header>

      {/* 본문 영역 */}
      <div style={{
        maxWidth: "100%", 
        margin: "0 auto", 
        padding: "0 20px 40px", 
        textAlign: "center",
        boxSizing: "border-box"
      }}>
        {/* 상단 이미지 */}
        <img
          src="/오늘의문제.png"
          alt="오늘의 문제"
          style={{
            width: "350px", 
            animation: "hueRotate 5s infinite linear",
            filter: "hue-rotate(0deg)", 
            marginTop: "100px", 
            marginBottom: "30px"
          }}
        />

        {/* 문제 제목 및 링크 */}
        <p style={{ marginTop: "30px", fontSize: "20px" }}>
          &nbsp;
          {todayProblemId ? (
            <a
              href={`https://www.acmicpc.net/problem/${todayProblemId}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "#ffffff", fontWeight: "bold", textDecoration: "underline"
              }}
            >
              {todayProblemTitle
                ? `${todayProblemTitle} (${todayProblemId}번) 풀기`
                : `백준 ${todayProblemId}번 풀기`}
            </a>
          ) : (
            <span style={{ color: "white" }}>문제를 불러오는 중입니다...</span>
          )}
        </p>

        {/* 백준 사이트 바로가기 링크 */}
        <a
          href="https://www.acmicpc.net/problemset"
          target="_blank"
          style={{
            display: "block", marginTop: "20px",
            textDecoration: "underline", color: "#afefff", fontWeight: "bold"
          }}
        >
          사이트 바로가기
        </a>


        {/* 두 개 박스 - 도장, 차트 */}
        <div style={{
         display: "flex",
         justifyContent: "center",
        flexWrap: "wrap",
          marginTop: "40px",
          gap: "40px"
        }}>
         {/* 왼쪽 - 도장 (동기화 용도도) */}
           <div
            onClick={handleRefresh}
            style={{
              width: "300px",
              height: "300px",
              backgroundColor: "#1a1e2a",
              border: "2px solid #00e5ff",
              borderRadius: "16px",
              boxShadow: "0 0 12px rgba(0, 229, 255, 0.25)",
              padding: "20px",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
             justifyContent: "center",
             color: "#e0f7fa",
             boxSizing: "border-box",
              flex: "none",  
            }}
  >
            <img
              src="/완료도장.png"
              alt="도장"
              style={{
                width: "50%",
                marginTop:"20px",
                filter: hasSolvedToday ? "none" : "grayscale(100%)",
                boxShadow: hasSolvedToday ? "0 0 15px 5px #ff5252" : "none",
                transition: "filter 0.3s ease, box-shadow 0.3s ease",
                borderRadius: "8px",
              }}
            />
            <p style={{ marginTop: "20px", fontWeight: "bold", textAlign: "center" }}>
              {hasSolvedToday ? "오늘의 문제 풀기 완료 ! !" : "문제 제출 후 클릭 !"}
            </p>
          </div>

          {/* 오른쪽 - 차트 */}
          <div
            style={{
              width: "300px",
              height: "300px",
              backgroundColor: "#1a1e2a",
              border: "2px solid #00e5ff",
              borderRadius: "16px",
              boxShadow: "0 0 12px rgba(0, 229, 255, 0.25)",
              padding: "10px",
              color: "#e0f7fa",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              flex: "none",  // ✅ 고정
            }}
          >
            <h3 style={{ marginTop:"15px", margin: 0, fontSize: "16px" }}>현재 학생들의 완료</h3>
           <PieChart width={200} height={200}>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={40}    
            outerRadius={75}   
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
          >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
            <p style={{ fontSize: "13px", marginTop: "0px", textAlign: "center" }}>
              {solvedCount}명이 풀었습니다<br />
              (전체 {totalUsers}명 중)
            </p>
          </div>
        </div> 
      </div>
    </div>
  );
}

export default Dayquest;



import { useEffect, useState } from "react";
import axios from "axios";
import viteLogo from '/vite.svg'
import { PieChart, Pie, Cell } from 'recharts';
import '../App.css' // css 스타일일

function Dayquest({ userId, problemId }) {
  const [count, setCount] = useState(false);

 const [data, setData] = useState([
    { name: '현재 푼 학생', value: 0 },
    { name: '현재 아직 못 푼 학생', value: 100 },
  ]);

  useEffect(() => {
    axios.get("http://localhost:4000/solved/check", {
      params: { userId, problemId }
    }).then((res) => {
      const isSolved = res.data.solved;
      setData([
        { name: '풀었음', value: isSolved ? 100 : 0 },
        { name: '못 풀었음', value: isSolved ? 0 : 100 },
      ]);
    }).catch(err => {
      console.error("체크 실패:", err);
    });
  }, [userId, problemId]);


  const COLORS = ['#00C49F', '#FF8042'];

const [todayProblemId, setTodayProblemId] = useState(null);

useEffect(() => {
  axios.get("http://localhost:4000/dayquest/today")
    .then((res) => {
      console.log("💡 오늘의 문제 ID:", res.data.id);
      setTodayProblemId(res.data.id);
    })
    .catch((err) => {
      console.error("오늘의 문제 가져오기 실패:", err);
    });
}, []);


  return (
    <div
      style={{
        fontFamily: 'Arial, sans-serif',
        minHeight: '100vh',
        overflowX: 'hidden', // ✅ 가로 스크롤 방지
      }}
    >
      {/* 상단바 */}
      <header
        style={{
          width: '100%',
          backgroundColor: '#2b2d42',
          color: 'white',
          padding: '18px 40px',
          fontSize: '18px',
          fontWeight: 'bold',
          marginBottom: '40px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxSizing: 'border-box',
        }}
      >
        일일 퀘스트
        <button
          onClick={() => (window.location.href = '/')}
          style={{
            padding: '8px 16px',
            fontSize: '14px',
            backgroundColor: 'white',
            color: '#2b2d42',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          홈으로
        </button>
      </header>

      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px 40px',
          textAlign: 'center',
          boxSizing: 'border-box',
        }}
      >
        <img
          src="/오늘의문제.png"
          alt="오늘의 문제"
          style={{
            width: '350px',
            animation: 'hueRotate 5s infinite linear',
            filter: 'hue-rotate(0deg)',
            marginTop :"50px",
            marginBottom: '30px',
          }}
        />

        <p style={{ marginTop: '30px', fontSize: '18px' }}>
  &nbsp;
  {todayProblemId ? (
    <a
      href={`https://www.acmicpc.net/problem/${todayProblemId}`}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        color: '#ffffff',
        fontWeight: 'bold',
        textDecoration: 'underline',
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
            display: 'block',
            marginTop: '20px',
            textDecoration: 'underline',
            color: '#ffffff',
            fontWeight: 'bold',
          }}
        >
          사이트 바로가기
        </a>

        {/* 두 개 박스 */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            marginTop: '40px',
            gap: '20px',
          }}
        >
          {/* 왼쪽 박스 */}
          <div
            onClick={() => setCount(!count)}
            style={{
              flex: '1 1 300px',
              background: 'white',
              padding: '20px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxSizing: 'border-box',
            }}
          >
            <img
              src="/완료도장.png"
              alt="도장"
              style={{
                width: '70%',
                filter: count ? 'none' : 'grayscale(100%)',
                transition: 'filter 0.3s ease-in-out',
              }}
            />
            <p style={{ marginTop: '10px', color: '#2b2d42' }}>
              {count ? '내가 완료함' : '아직 안 했음'}
            </p>
          </div>

          {/* 오른쪽 박스 */}
          <div
            style={{
              flex: '1 1 300px',
              background: 'white',
              padding: '20px',
              boxSizing: 'border-box',
              textAlign: 'center',
              borderLeft: '1px solid #ccc',
            }}
          >
            <h3 style={{ margin: 0, color: '#2b2d42' }}>
              현재 학생들의 완료
            </h3>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                marginTop: '20px',
              }}
            >
              <PieChart width={200} height={200}>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
              <p style={{ marginTop: '10px', color: '#2b2d42' }}>
                52명이 풀었습니다 <br /> (전체 100명 중)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dayquest;

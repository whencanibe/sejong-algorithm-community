import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Cell, LabelList } from "recharts";
import {
  BarChart, Bar, Legend, XAxis as BXAxis, YAxis as BYAxis,
  CartesianGrid as BGrid, Tooltip as BTooltip, ResponsiveContainer as BContainer
} from "recharts";
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  CartesianGrid, ReferenceDot, ResponsiveContainer
} from "recharts";

function useWindowSize() {
  const [size, setSize] = useState([window.innerWidth, window.innerHeight]);
  useEffect(() => {
    const handleResize = () => {
      setSize([window.innerWidth, window.innerHeight]);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return size;
}

function UniversityRanking() {
  const navigate = useNavigate();
  const [windowWidth] = useWindowSize();
  const [userInfo, setUserInfo] = useState(null);
  const [deptRanking, setDeptRanking] = useState([]);
  const [percentile, setPercentile] = useState(0);
  const [rankInfo, setRankInfo] = useState({ rank: 0, total: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        await axios.post(`http://localhost:4000/info/api/refresh`, {}, {
          withCredentials: true,
        });

        const userRes = await axios.get(`http://localhost:4000/info/api/mypage`, {
          withCredentials: true,
        });
        const userData = userRes.data;
        setUserInfo(userData);
        setPercentile(userData.percentile ?? 0);

        const statusRes = await axios.get(`http://localhost:4000/dayquest/status`, {
        withCredentials: true,
        });
        const { totalUsers } = statusRes.data;
        setRankInfo({ rank: userData.rank ?? 0, total: totalUsers });
        
        const rankingRes = await fetch(`http://localhost:4000/info/api/globalranking`, {
          credentials: 'include',
        });
        const rankData = await rankingRes.json();
        setDeptRanking(rankData.slice(1));
      } catch (err) {
        console.error("데이터 불러오기 실패:", err);
      }
    };
    fetchData();
  }, [navigate]);

  if (!userInfo) {
    return <div style={{ padding: "40px", fontSize: "18px" }}>로딩 중...</div>;
  }

  const data = deptRanking.map((dept) => ({
    name: dept.department,
    solved: dept.solvedThisWeek
  }));

  const sortedData = [...data].sort((a, b) => b.solved - a.solved);
  const myName = userInfo?.department ?? '';
  const rank = userInfo?.rank ?? 0;
  const total = userInfo?.total ?? 0;
  const myData = sortedData.find((d) => d.name === myName);

  // 정규분포용 데이터
  const myX = 100 - percentile;
  const myY = Math.exp(-((myX - 50) ** 2) / (2 * 15 ** 2));

  const curveData = Array.from({ length: 100 }, (_, i) => {
    const x = i;
    const y = Math.exp(-((x - 50) ** 2) / (2 * 15 ** 2));
    return { x, y };
  });

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      gap: '30px',
      flexWrap: 'wrap',
      padding: '0px',
      width: '100%',
      boxSizing: 'border-box',
      color: '#e0f7fa',
    }}>
      {/* 왼쪽 그래프 영역 */}
      <div
        style={{
          flex: '1 1 700px',
          minWidth: '600px',
          maxWidth: '1000px',
          display: 'flex',
          flexDirection: 'column',
          gap: '40px'
        }}
      >
        {/* 상위 퍼센트 시각화 바 */}
        <div style={{
          width: '90%',
          height: '50px',
          background: '#f0fdff',
          borderRadius: '10px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          boxShadow: '0 0 6px rgba(0,0,0,0.1)',
          marginTop: '10px',
          marginLeft: '30px'
        }}>
          <div style={{ marginBottom: '10px', fontWeight: 'bold', color: '#1e293b' }}>
             <span style={{ color: '#00e5ff' }}>{userInfo?.name}</span>님의 백준 티어: 세종대 학생 {rankInfo.total}명 중 {rankInfo.rank}등
          </div>
          <div style={{
            height: '18px',
            width: '100%',
            backgroundColor: '#cfe8f9',
            borderRadius: '10px',
            overflow: 'hidden',
          }}>
            <div
              style={{
                height: '100%',
                width: `${100 - percentile}%`,
                backgroundColor: '#3b82f6',
                borderRadius: '10px 0 0 10px',
                transition: 'width 0.5s ease'
              }}
            ></div>
          </div>
        </div>

        {/* 정규분포 그래프 */}
        <div style={{ width: '100%', height: '150px' }}>
          <h2 style={{ textAlign: 'center', marginTop: 0 }}>(세종대) 백준 티어 랭킹</h2>
          <ResponsiveContainer key={windowWidth} width="100%" height="100%">
            <LineChart data={curveData} margin={{ top: 25, right: 70, left: 70, bottom: 5 }}>
              <XAxis
                dataKey="x"
                domain={[0, 100]}
                label={{
                  value: "백분율 (%)",
                  position: "insideBottom",
                  offset: -4,
                  fill: "#6f728c",
                  fontSize: 12,
                }}
              />
              <YAxis hide />
              <Tooltip
                content={({ active, payload, label }) =>
                  active && payload?.length ? (
                    <div style={{
                      background: '#fff',
                      padding: '8px 12px',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}>
                      <span style={{ color: '#000' }}>{label}%</span>
                    </div>
                  ) : null
                }
              />
              <Line type="monotone" dataKey="y" stroke="#6f728c" dot={false} />
              <ReferenceDot
                x={myX}
                y={myY}
                r={5}
                fill="#00e5ff"
                stroke="none"
                label={{
                  value: `나의 위치 (상위 ${percentile}%)`,
                  position: "top",
                  fontSize: 14,
                  fill: "#00e5ff",
                }}
                style={{ filter: "drop-shadow(0 0 6px #00e5ff)" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 학과별 풀이 수 랭킹 */}
        <div style={{ width: '100%', height: '300px', marginTop: '40px' }}>
          <h2 style={{ textAlign: 'center' }}>(세종대) 이번주 백준 풀이 랭킹</h2>
          <BContainer key={windowWidth} width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={sortedData}
              margin={{ top: 0, right: 70, left: 70, bottom: 50 }}
              barCategoryGap="10%"
            >
              <BGrid strokeDasharray="3 3" />
              <BXAxis type="number" domain={[0, Math.max(...sortedData.map(d => d.solved))]} />
              <BYAxis
                type="category"
                dataKey="name"
                tick={({ x, y, payload }) => {
                  const isMe = payload.value === myName;
                  return (
                    <text
                      x={x}
                      y={y + 4}
                      textAnchor="end"
                      fill={isMe ? "#00e5ff" : "#6f728c"}
                      style={{
                        fontSize: 14,
                        fontWeight: isMe ? "bold" : "normal",
                      }}
                    >
                      {payload.value}
                    </text>
                  );
                }}
              />
              <BTooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const { name, solved } = payload[0].payload;
                    const isMe = name === myName;
                    return (
                      <div style={{
                        background: "#fff",
                        border: "1px solid #ccc",
                        borderRadius: "6px",
                        padding: "10px",
                        fontSize: "14px",
                        boxShadow: "0 0 6px rgba(0, 0, 0, 0.2)",
                      }}>
                        <div style={{
                          fontWeight: "bold",
                          color: isMe ? "#00e5ff" : "#6f728c",
                        }}>
                          {name}
                        </div>
                        <div style={{ color: "#000" }}>
                          문제 풀이 수: {solved}개
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend />
              <Bar dataKey="solved" name="문제 풀이 수">
                <LabelList
                  dataKey="solved"
                  position="right"
                  formatter={(value, entry) => {
                    const isMe = entry?.payload?.name === myName;
                    return `${value}개`;
                  }}
                />
                {sortedData.map((entry, index) => {
                  const isMe = entry.name === myName;
                  return (
                    <Cell
                      key={`cell-${index}`}
                      fill={isMe ? "#00e5ff" : "#6f728c"}
                      style={isMe ? { filter: "drop-shadow(0 0 6px #00e5ff)" } : {}}
                    />
                  );
                })}
              </Bar>
            </BarChart>
          </BContainer>
        </div>
      </div>

      {/* 내 정보 카드 */}
      <div
        style={{
          flex: '0 0 300px',
          minWidth: '280px',
          background: '#1e293b',
          color: '#ffffff',
          fontWeight: '500',
          padding: '24px',
          borderRadius: '10px',
          boxShadow: '0 0 12px rgba(0, 229, 255, 0.2)',
          boxSizing: 'border-box',
          alignSelf: 'flex-start',
          marginTop: '50px',
        }}
      >
        <h3 style={{
          fontSize: '20px',
          marginBottom: '16px',
          fontWeight: '700',
          color: '#00e5ff',
          textShadow: '0 0 4px #00e5ff99'
        }}>
          👤 내 정보
        </h3>
        <div style={{ marginBottom: '10px' }}>
          <strong style={{ fontWeight: '600' }}>백준 ID:</strong> {userInfo?.baekjoonName ?? '-'}
        </div>
        <div style={{ marginBottom: '10px' }}>
          <strong style={{ fontWeight: '600' }}>티어:</strong> {userInfo?.tier ?? '-'}
        </div>
        <div style={{ marginBottom: '10px' }}>
          <strong style={{ fontWeight: '600' }}>세종대 상위 퍼센트:</strong> {percentile}%
        </div>
        <div style={{ marginBottom: '10px' }}>
          <strong style={{ fontWeight: '600' }}>총 풀이:</strong> {userInfo?.totalSolvedCount ?? 0}개
        </div>
      </div>
    </div>
  );
}

export default UniversityRanking;

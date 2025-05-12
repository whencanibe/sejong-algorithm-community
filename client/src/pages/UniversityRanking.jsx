import { useEffect, useState } from "react";
import { Cell, LabelList } from "recharts";

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

import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  CartesianGrid, ReferenceDot, ResponsiveContainer,
  BarChart, Bar, Legend
} from "recharts";
import {
  XAxis as BXAxis, YAxis as BYAxis,
  CartesianGrid as BGrid, Tooltip as BTooltip,
  ResponsiveContainer as BContainer
} from "recharts";

function UniversityRanking() {
  const [windowWidth] = useWindowSize();
  // 곡선 데이터
  const curveData = Array.from({ length: 100 }, (_, i) => {
    const x = i;
    const y = Math.exp(-((x - 50) ** 2) / (2 * 15 ** 2));
    return { x, y };
  });

  const myX = 65;
  const myY = Math.exp(-((myX - 50) ** 2) / (2 * 15 ** 2));
  const percentile = 100 - Math.round((myX / 100) * 100);

  // 막대그래프 데이터
  const data = [
    { name: '소프트웨어22', solved: 12 },
    { name: '컴퓨터공학22', solved: 17 },
    { name: '컴퓨터공학21', solved: 5 },
    { name: '소프트웨어21', solved: 3 },
    { name: '컴퓨터공학23', solved: 24 },
  ];
  const sortedData = [...data].sort((a, b) => b.solved - a.solved);
  const myName = '소프트웨어22';
  const myData = sortedData.find((d) => d.name === myName);
  
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: '40px',
      flexWrap: 'wrap',
      padding: '40px',
    }}>
      
      {/* 왼쪽: 그래프 2개 세로 정렬 */}
      <div style={{ flex: '1 1 700px', display: 'flex', flexDirection: 'column', gap: '40px' }}>
        
        {/* 곡선 그래프 */}
        <div style={{ width: '100%', height: '250px' }}>
          <h2 style={{ textAlign: 'center' }}>(세종대) 백준 티어 랭킹</h2>
          <ResponsiveContainer key={windowWidth} width="100%" height="100%">
            <LineChart data={curveData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="x" domain={[0, 100]} />
              <YAxis />
              <Tooltip content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div style={{
                      background: '#fff',
                      padding: '8px 12px',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}>
                      <strong>{label}점</strong>
                    </div>
                  );
                }
                return null;
              }} />
              <Line type="monotone" dataKey="y" stroke="#8884d8" dot={false} />
              <ReferenceDot
                x={myX}
                y={myY}
                r={5}
                fill="black"
                stroke="none"
                label={{
                  value: `나의 위치 (상위 ${percentile}%)`,
                  position: "right",
                  fontSize: 14,
                  fill: "#000",
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 막대 그래프 */}
        <div style={{ width: '100%', height: '350px', marginTop: '30px' }}>
          <h2 style={{ textAlign: 'center' }}>(세종대) 이번주 백준 풀이 랭킹</h2>
          <BContainer key={windowWidth} width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={sortedData}
              margin={{ top: 0, right: 50, left: 50, bottom: 50 }}
              barCategoryGap="10%"
            >
              <BGrid strokeDasharray="3 3" />
              <BXAxis type="number" domain={[0, Math.max(...sortedData.map(d => d.solved))]} />
              <BYAxis type="category" dataKey="name" />
              <BTooltip />
              <Legend />
              <Bar dataKey="solved" name="문제 풀이 수">
                <LabelList
                  data={sortedData}
                  dataKey="solved"
                  position="right"
                  formatter={(value, entry = {}, index) => {
                    const name = typeof entry.name === 'string' ? entry.name : '';
                    const isMe = name === myName;
                    return `${name}${isMe ? ' (나)' : ''} ${value}개`;
                  }}
                />

                {sortedData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.name === myName ? "#ff6b6b" : "#8884d8"}
                  />
                ))}
              </Bar>
            </BarChart>
          </BContainer>
        </div>
      </div>

      {/* 오른쪽: 내 정보 */}
      <div style={{
        flex: '0 0 300px',
        background: '#f9f9f9',
        padding: '24px',
        borderRadius: '10px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        boxSizing: 'border-box',
        marginTop: '80px',
        }}>
  <h3 style={{ fontSize: '20px', marginBottom: '16px' }}>👤 내 정보</h3>
        <div style={{ marginBottom: '10px' }}><strong>백준 ID:</strong> {myName}</div>
        <div style={{ marginBottom: '10px' }}>
          <strong>이번주 풀이:</strong> {myData ? myData.solved : '-'}개
        </div>
        <div style={{ marginBottom: '10px' }}><strong>티어:</strong> 실버 III 🥈</div>
        <div><strong>상위 퍼센트:</strong> {percentile}%</div>
      </div>
    </div>
  );
}

export default UniversityRanking;

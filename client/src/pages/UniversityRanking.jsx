import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Cell, LabelList } from "recharts";
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        await axios.post(`http://localhost:4000/info/api/refresh`, {}, {
                  withCredentials: true, // 쿠키 포함!
                });
                
        const meRes = await fetch("http://localhost:4000/user/me", { credentials: "include" });
        const me = await meRes.json();

        if (!me.user?.id) {
          alert("로그인이 필요합니다");
          navigate("/");
          return;
        }

        const userRes = await fetch(`http://localhost:4000/info/api/mypage/${me.user.id}`);
        const userData = await userRes.json();
        setUserInfo(userData);
        setPercentile(userData.percentile ?? 0);

        const rankingRes = await fetch(`http://localhost:4000/info/api/deptranking`);
        const rankData = await rankingRes.json();
        setDeptRanking(rankData.slice(1));
      } catch (err) {
        console.error("데이터 불러오기 실패:", err);
      }
    };
    fetchData();
  }, [navigate]);

  const data = deptRanking.map((dept) => ({
    name: dept.department,
    solved: dept.solvedThisWeek
  }));

  const sortedData = [...data].sort((a, b) => b.solved - a.solved);
  const myName = userInfo?.department ?? '';
  const myData = sortedData.find((d) => d.name === myName);

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
        <div style={{ width: '100%', height: '240px' }}>
          <h2 style={{ textAlign: 'center' }}>(세종대) 백준 티어 랭킹</h2>
          <ResponsiveContainer key={windowWidth} width="100%" height="100%">
             <LineChart data={curveData} margin={{ top: 0, right: 70, left: 70, bottom: 0 }}>
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
              <Line type="monotone" dataKey="y" stroke="#6f728c" dot={false} />
              <ReferenceDot
                x={myX}
                y={myY}
                r={5}
                fill="#ff6b6b"
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

        <div style={{ width: '100%', height: '320px', marginTop: '40px' }}>
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
                    fill={entry.name === myName ? "#ff6b6b" : "#6f728c"}
                  />
                ))}
              </Bar>
            </BarChart>
          </BContainer>
        </div>
      </div>

      {/* 오른쪽 내 정보 카드 */}
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
          <strong style={{ fontWeight: '600' }}>총 풀이:</strong> {userInfo?.solvedNum ?? 0}개
        </div>
        <div style={{ marginBottom: '10px' }}>
          <strong style={{ fontWeight: '600' }}>이번주 풀이:</strong> {myData?.solved ?? 0}개
        </div>
        <div style={{ marginBottom: '10px' }}>
          <strong style={{ fontWeight: '600' }}>티어:</strong> {userInfo?.tier ?? '-'}
        </div>
        <div>
          <strong style={{ fontWeight: '600' }}>상위 퍼센트:</strong> {percentile}%
        </div>
      </div>
    </div>
  );
}

export default UniversityRanking;

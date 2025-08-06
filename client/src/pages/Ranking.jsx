import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import UniversityRanking from './UniversityRanking';
import DepartmentRanking from './DepartmentRanking';

function Ranking() {
  const [activeTab, setActiveTab] = useState('university'); // 현재 선택된 탭 상태
  const [isLoggedIn, setIsLoggedIn] = useState(false);       // 로그인 여부
  const navigate = useNavigate();

  // 로그인 확인
  useEffect(() => {
    axios.get("http://localhost:4000/info/api/basicprofile", { withCredentials: true })
      .then(() => setIsLoggedIn(true)) // 세션이 유효하면 로그인 인정
      .catch(() => {
        alert("로그인이 필요합니다."); // 세션 만료 또는 비로그인 시 알림
        navigate("/login");            // 로그인 페이지로 이동
      });
  }, []);

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#0d1117', color: '#e0f7fa' }}>
      {/* 고정 헤더 */}
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          backgroundColor: "#0d1117", 
          color: "#afefff", 
          padding: '18px 40px',
          fontSize: '18px',
          fontWeight: 'bold',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxSizing: 'border-box',
          zIndex: 1000,
          borderBottom: "1px solid #00e5ff", 
          boxShadow: "0 2px 8px rgba(0, 229, 255, 0.15)",
          animation: "neonFlicker 1.5s infinite alternate", 
        }}
      >
        랭킹 페이지
        <button
          onClick={() => navigate('/')} // 홈으로 이동 버튼
          style={{
            padding: '8px 16px',
            fontSize: '14px',
            backgroundColor: '#afefff',
            color: '#0d1117',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
            boxShadow: '0 0 10px #00e5ff',
          }}
        >
          홈으로
        </button>
      </header>

      {/* 본문 */}
      <main
        style={{
          marginTop: '70px', // 헤더 공간 확보
          padding: '0 40px 40px',
          boxSizing: 'border-box',
          maxWidth: '1200px',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >

        {/* 배경 이미지: 천왕성 */}
        <img
          src="/배경/천왕성.png" 
          alt="floating-astronaut"
          style={{
            position: "absolute",
            top: "100px",
            right: "100px",
            width: "140px",
            animation: "float-spin2 6s ease-in-out infinite",
            zIndex: 1,
            filter: "drop-shadow(0 0 6px white)",
          }}
        />

        {/* 탭 버튼 영역 */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <button
            onClick={() => setActiveTab('university')} // 세종대학교 전체 탭
            style={{
              padding: '10px 20px',
              backgroundColor: activeTab === 'university' ? '#00e5ff' : '#1e293b',
              color: activeTab === 'university' ? '#0d1117' : '#e0f7fa',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold',
              boxShadow: activeTab === 'university' ? '0 0 8px #00e5ff' : 'none',
            }}
          >
            세종대학교
          </button>
          <button
            onClick={() => setActiveTab('department')} // 학과별 탭
            style={{
              padding: '10px 20px',
              backgroundColor: activeTab === 'department' ? '#00e5ff' : '#1e293b',
              color: activeTab === 'department' ? '#0d1117' : '#e0f7fa',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold',
              boxShadow: activeTab === 'department' ? '0 0 8px #00e5ff' : 'none',
            }}
          >
            학과
          </button>
        </div>

        {/* 탭에 따라 컴포넌트 렌더링 */}
        <div style={{ width: '100%' }}>
          {activeTab === 'university' ? <UniversityRanking /> : <DepartmentRanking />}
        </div>
      </main>
    </div>
  );
}

export default Ranking;

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UniversityRanking from './UniversityRanking';
import DepartmentRanking from './DepartmentRanking';

function Ranking() {
  const [activeTab, setActiveTab] = useState('university');
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#0d1117', color: '#e0f7fa' }}>
      {/* 고정 헤더 */}
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          backgroundColor: '#121826',
          color: '#b3e5fc',
          padding: '18px 40px',
          fontSize: '18px',
          fontWeight: 'bold',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxSizing: 'border-box',
          zIndex: 1000,
          boxShadow: '0 2px 10px #00e5ff55',
        }}
      >
        랭킹 페이지
        <button
          onClick={() => navigate('/home')}
          style={{
            padding: '8px 16px',
            fontSize: '14px',
            backgroundColor: '#00e5ff',
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
          marginTop: '70px',
          padding: '0 40px 40px',
          boxSizing: 'border-box',
          maxWidth: '1200px',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
        {/* 탭 버튼 */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <button
            onClick={() => setActiveTab('university')}
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
            onClick={() => setActiveTab('department')}
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

        {/* 탭 내용 */}
        <div style={{ width: '100%' }}>
          {activeTab === 'university' ? <UniversityRanking /> : <DepartmentRanking />}
        </div>
      </main>
    </div>
  );
}

export default Ranking;

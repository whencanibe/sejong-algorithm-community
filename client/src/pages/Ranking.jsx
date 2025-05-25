import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UniversityRanking from './UniversityRanking';
import DepartmentRanking from './DepartmentRanking';

function Ranking() {
  const [activeTab, setActiveTab] = useState('university'); // 세종대학교 탭이 디폴트
  const navigate = useNavigate();

  return (
    <div
      style={{
        fontFamily: 'Arial, sans-serif',
        minHeight: '100vh',
        backgroundColor: '#fff',
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
        랭킹 페이지
        <button
          onClick={() => navigate('/home')}
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

      {/* 본문 */}
      <main
        style={{
          width: '100%',
          padding: '0 40px 40px',
          boxSizing: 'border-box',
        }}
      >
        {/* 탭 버튼 */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <button
            onClick={() => setActiveTab('university')}
            style={{
              padding: '10px 20px',
              backgroundColor: activeTab === 'university' ? '#6f728c' : '#e0e0e0',
              color: activeTab === 'university' ? 'white' : 'black',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            세종대학교
          </button>
          <button
            onClick={() => setActiveTab('department')}
            style={{
              padding: '10px 20px',
              backgroundColor: activeTab === 'department' ? '#6f728c' : '#e0e0e0',
              color: activeTab === 'department' ? 'white' : 'black',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            학과
          </button>
        </div>

        {/* 탭 내용 */}
        <div style={{ width: '100%' }}>
          {activeTab === 'university' ? (
            <UniversityRanking />
          ) : (
            <DepartmentRanking />
          )}
        </div>
      </main>
    </div>
  );
}

export default Ranking;
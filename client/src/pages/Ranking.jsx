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
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        marginLeft: '40px', 
      }}
    >
       <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
        <button
          onClick={() => navigate('/mypage')}
            style={{
            padding: '8px 16px',
            backgroundColor: '#4f46e5',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          마이페이지
        </button>
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={() => setActiveTab('university')}>
          세종대학교
        </button>
        <button onClick={() => setActiveTab('department')}>
          학과
        </button>
      </div>

      <div style={{ marginTop: '20px', width: '100%' }}>
        {activeTab === 'university' ? (
          <UniversityRanking />
        ) : (
          <DepartmentRanking />
        )}
      </div>
    </div>
  );
}

export default Ranking;

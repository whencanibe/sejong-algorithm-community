import { useState } from 'react';
import UniversityRanking from './UniversityRanking';
import DepartmentRanking from './DepartmentRanking';

function Ranking() {
  const [activeTab, setActiveTab] = useState('university'); // 세종대학교 탭이 디폴트
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        marginLeft: '40px', 
      }}
    >
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

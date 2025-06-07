import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function LoginWindow() {
  const navigate = useNavigate();
  const [showButton, setShowButton] = useState(false); // 버튼 렌더링 여부

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowButton(true);
    }, 3000); // 버튼 애니메이션은 3초 후에 시작
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      style={{
        position: 'relative',
        width: "100%",
        backgroundColor: "#0d1117",
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      
      }}
    >
      {/* 우주선 애니메이션 */}
      <img
        src="/우주선.png"
        alt="spaceship"
        style={{
          position: 'absolute',
          top: '30%',
          width: '150px',
          animation: 'flyInFromRight 8s ease-out forwards, floatY 2s ease-in-out infinite',
          zIndex: 2,
          
        }}
      />

      {/* 로그인창 본체는 항상 있음 */}
      <div
        style={{
          width: "400px",
          height: "300px",
          border: "2px solid #00e5ff", 
          padding: "24px",
          borderRadius: "14px",
          backgroundColor: "#1a1e2a", 
          color: "#e0f7fa",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          boxShadow: "0 4px 10px rgba(63, 63, 255, 0.1)",
          zIndex: 1,
        }}
      >
        <h3 style={{ fontSize: "18px", color: "#e0f7fa", marginBottom: "16px" }}>
          로그인이 필요합니다 !!
        </h3>

        {/* 로그인 버튼은 3초 후에 등장 + 애니메이션 */}
        {showButton && (
          <button
            onClick={() => navigate("/login")}
            style={{
            position: 'absolute',
            top: '30%',
            left: '100%',
            animation: 'buttonFlyIn 1.5s ease-out forwards, buttonFloat 2s ease-in-out infinite',
            zIndex: 1,
            padding: "8px 16px", 
            backgroundColor: "#afefff", 
            color: "#0d1117",
            border: "none", 
            borderRadius: "4px", 
            cursor: "pointer",
            fontWeight: "bold", 
            boxShadow: "0 0 10px #00e5ff", 
            fontSize: "18px",
            marginRight: "60px",
            }}
          >
            로그인하러 가기
          </button>
        )}
      </div>

      <div style={{ position: 'relative',  }}>
       {/* 몬스터 이미지 */} 
       <img
  src="/몬스터.png"
  alt="alien"
  style={{
    position: 'absolute',
    bottom: '-140px', // 🔽 아래쪽 여백을 기준으로 고정 (예: 로그인 박스 테두리 위)
    right: '10px',  // 📍 로그인 박스 오른쪽에 "앉아 있는 느낌" 위치
    width: '100px',  // 🧸 필요시 크기도 조정
    transform: 'translateY(20%)', // ⬆ 테두리 위에 살짝 걸터앉은 듯
    zIndex: 2,
  }}
/>

      </div>
    </div>
  );
}

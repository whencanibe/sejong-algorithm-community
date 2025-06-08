import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

// 로그인 유도 컴포넌트
export default function LoginWindow() {
  const navigate = useNavigate();

  // 3초 뒤에 버튼을 보여주기 위한 상태
  const [showButton, setShowButton] = useState(false);

  // 컴포넌트가 마운트된 후 3초 뒤에 버튼 표시
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowButton(true);
    }, 3000);
    return () => clearTimeout(timer); // cleanup
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

      {/*  우주선 등장 애니메이션 */}
      <img
        src="/배경/우주선.png"
        alt="spaceship"
        style={{
          position: 'absolute',
          top: '30%',
          width: '120px',
          animation: 'flyInFromRight 8s ease-out forwards, floatY 2s ease-in-out infinite',
          zIndex: 2,
        }}
      />

      {/*  로그인 안내창 본체 */}
      <div
        style={{
          width: "250px",
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
        {/* 안내 문구 */}
        <h3 style={{ fontSize: "18px", color: "#e0f7fa", marginBottom: "16px" }}>
          로그인이 필요합니다 !!
        </h3>

        {/*  3초 후 등장하는 로그인 버튼 */}
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
            로그인하러
             가기
          </button>
        )}
      </div>

      {/*  몬스터 이미지 */}
      <div style={{ position: 'relative' }}>
        <img
          src="/몬스터.png"
          alt="alien"
          style={{
            position: 'absolute',
            bottom: '-140px',
            right: '10px',
            width: '100px',
            transform: 'translateY(20%)',
            zIndex: 2,
          }}
        />
      </div>
    </div>
  );
}

import { useNavigate } from 'react-router-dom';

export default function LoginWindow() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        width: "400px",
        border: "1px solid #00e5ff",
        padding: "24px",
        borderRadius: "14px",
        backgroundColor: "#2a3142",
        color: "#e0f7fa",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        boxShadow: "0 4px 10px rgba(63, 63, 255, 0.1)",
      }}
    >
      <h3 style={{ fontSize: "18px", color: "#3f3fff", marginBottom: "16px" }}>
        로그인 필요
      </h3>

      <button
        onClick={() => navigate("/login")}
        style={{
          padding: '8px 16px',
          fontSize: '14px',
          backgroundColor: '#3f3fff',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: 'bold',
        }}
      >
        로그인하러 가기
      </button>
    </div>
  );
}

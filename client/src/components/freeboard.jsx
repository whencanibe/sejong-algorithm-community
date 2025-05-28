import { useNavigate } from "react-router-dom";

export default function FreeBoardPreview({ posts }) {
  const navigate = useNavigate();

  return (
    <div
      style={{
        width: "400px",
        height: "250px",
        border: "1px solid #00e5ff",  
        borderRadius: "10px",
        padding: "20px",
        boxSizing: "border-box",
        backgroundColor: "#2a3142",                     // 🔵 다크 블루 배경
        color: "#e0f7fa", 
        boxShadow: "0 4px 10px rgba(63, 63, 255, 0.1)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        marginTop: "50px",
        marginLeft: "30px",
      }}
    >
      {/* 제목 + + 버튼 */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
          
        }}
        
      >
        <h3 style={{ margin: 0, color: "#3f3fff", fontWeight: "bold" }}>자유게시판</h3>
        <button
          onClick={() => navigate("/community/writepost")}
          style={{
            width: "28px",
            height: "28px",
            borderRadius: "50%",
            border: "2px solid #3f3fff",
            background: "white",
            color: "#3f3fff",
            fontSize: "18px",
            fontWeight: "bold",
            cursor: "pointer",
            lineHeight: "22px",
            padding: 0,
          }}
        >
          +
        </button>
      </div>

      {/* 게시글 목록 */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {Array.isArray(posts) && posts.length > 0 ? (
          posts.slice(0, 3).map((post) => (
            <div
              key={post.id}
              onClick={() => navigate(`/community/postdetail/${post.id}`)}
              style={{
                fontSize: "14px",
                color: "ffffff",
                borderBottom: "1px solid #ddd",
                paddingBottom: "4px",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#3f3fff")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#333")}
            >
              {post.title}
            </div>
          ))
        ) : (
          <div style={{ fontSize: "14px", color: "ffffff" }}>게시글이 없습니다.</div>
        )}
        <div style={{ fontSize: "14px", color: "#bbb" }}>⋯</div>
      </div>
    </div>
  );
}

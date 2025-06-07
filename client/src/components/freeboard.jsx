import { useNavigate } from "react-router-dom";

// 자유게시판 미리보기 
export default function FreeBoardPreview({ posts, isLoggedIn }) {
  const navigate = useNavigate();

  return (
    <div
      style={{
        width: "360px",
        height: "250px",
        border: "2px solid #00e5ff", 
        borderRadius: "16px", 
        padding: "20px",
        boxSizing: "border-box",
        backgroundColor: "#1a1e2a", 
        color: "#e0f7fa", 
        boxShadow: "0 4px 10px rgba(63, 63, 255, 0.1)", 
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        marginTop: "50px",
        marginLeft: "15px",
         zIndex: 10,
        position: 'relative' ,
      }}

      
    >

      {/* 제목 영역 + 글쓰기 버튼 */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        {/* 게시판 제목 */}
        <h3 style={{ margin: 0, fontSize: "18px", color: "#afefff" }}>
          자유게시판
        </h3>

        {/* 글쓰기 버튼 */}
        <button
          onClick={() => {
            if (!isLoggedIn) {
              alert("로그인이 필요합니다.");
              navigate("/login"); // 로그인 안 되어 있으면 로그인 페이지로 이동
              return;
            }
            navigate("/community/writepost"); // 로그인 되어 있으면 글쓰기 페이지로 이동
          }}
          style={{
            width: "28px",
            height: "28px",
            borderRadius: "50%", 
            border: "2.5px solid #00e5ff",
            background: "white",
            color: "#0e0f37", 
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

      {/* 게시글 미리보기 목록 */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {Array.isArray(posts) && posts.length > 0 ? (
          posts.slice(0, 3).map((post) => (
            <div
              key={post.id}
              onClick={() => {
                if (!isLoggedIn) {
                  alert("로그인이 필요합니다.");
                  navigate("/login");
                  return;
                }
                navigate(`/community/postdetail/${post.id}`);
              }} // 게시글 클릭 시 상세 페이지 이동
              style={{
                fontSize: "14px",
                fontWeight: "600", 
                color: "ffffff", 
                borderBottom: "1px solid #ddd",
                paddingBottom: "4px",
                cursor: "pointer",
              }}
              
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "#00e5ff")
              }
            
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "#afefff")
              }
            >
              {post.title}
            </div>
          ))
        ) : (
          // 게시글이 없을 경우
          <div style={{ fontSize: "14px", color: "ffffff" }}>
            게시글이 없습니다.
          </div>
        )}

        {/* ... 표시 */}
        <div style={{ fontSize: "14px", color: "#bbb" }}>⋯</div>
      </div>
    </div>
  );
}

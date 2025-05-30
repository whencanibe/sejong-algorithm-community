import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import CommentSection from "../pages/commentsection";

function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:4000/posts/${id}`)
      .then((res) => {
        setPost(res.data);
      })
      .catch((err) => {
        console.error("글 불러오기 실패:", err);
      });
  }, [id]);

  const handleDeletePost = async () => {
    const confirm = window.confirm("정말 이 글을 삭제하시겠습니까?");
    if (!confirm) return;

    try {
      await axios.delete(`http://localhost:4000/posts/${id}`);
      alert("글이 삭제되었습니다.");
      navigate("/community");
    } catch (err) {
      console.error("삭제 실패:", err);
      alert("글 삭제 중 오류가 발생했습니다.");
    }
  };

  if (!post) return <div style={{ padding: "40px" }}>로딩 중...</div>;

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#0d1117",
        color: "#fff",
        minHeight: "100vh",
        width: "100vw", // ✅ 화면 전체 너비 사용
        overflowX: "hidden",
      }}
    >
      {/* 상단바 */}
      <header
        style={{
          width: "100%",
          backgroundColor: "#2a3142",
          padding: "16px 24px",
          fontSize: "18px",
          fontWeight: "bold",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        자유게시판
        <button
          onClick={() => navigate("/home")}
          style={{
            padding: "8px 16px",
            fontSize: "14px",
            backgroundColor: "#fff",
            color: "#2a3142",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          홈으로
        </button>
      </header>

      {/* 본문 */}
      <main
        style={{
          width: "100%", // ✅ 꽉 채우기
          backgroundColor: "#f8f9fa",
          color: "#000",
          padding: "40px 20px", // ✅ 내부 여백만 줌
          boxSizing: "border-box",
        }}
      >
        {/* 제목 + 삭제 버튼 */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h2 style={{ margin: 0 }}>{post.title}</h2>
          <button
            onClick={handleDeletePost}
            style={{
              padding: "8px 12px",
              backgroundColor: "#ff6b6b",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            글 삭제
          </button>
        </div>

        {/* 작성자/날짜 */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "14px",
            color: "#555",
            marginBottom: "30px",
          }}
        >
          <div>작성자: {post.author || "익명"}</div>
          <div>
            작성일:{" "}
            {post.date ? new Date(post.date).toLocaleDateString() : "알 수 없음"}
          </div>
        </div>

        {/* 본문 */}
        <div
          style={{
            fontSize: "16px",
            lineHeight: "1.6",
            marginBottom: "50px",
            whiteSpace: "pre-wrap",
          }}
        >
          {post.content}
        </div>

        {/* 댓글 */}
        <CommentSection />

        {/* 목록으로 돌아가기 */}
        <div style={{ marginTop: "40px", textAlign: "right" }}>
          <button
            onClick={() => navigate("/community")}
            style={{
              padding: "10px 16px",
              backgroundColor: "#cfd8dc",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            목록으로 돌아가기
          </button>
        </div>
      </main>
    </div>
  );
}

export default PostDetail;

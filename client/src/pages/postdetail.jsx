import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import CommentSection from "../pages/commentsection";

function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [input, setInput] = useState("");
  const [activeMenuId, setActiveMenuId] = useState(null); // ... 메뉴 열림 여부

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

  const handleAddComment = () => {
    if (input.trim() === "") return;
    const newComment = {
      id: Date.now(),
      nickname: "익명",
      text: input,
      isEditing: false,
      edited: false,
    };
    setComments([...comments, newComment]);
    setInput("");
  };

  const handleEditStart = (id) => {
    setComments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isEditing: true } : c))
    );
    setActiveMenuId(null);
  };

  const handleEditSubmit = (id, newText) => {
    setComments((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, text: newText, isEditing: false, edited: true } : c
      )
    );
  };

  const handleDelete = (id) => {
    setComments((prev) => prev.filter((c) => c.id !== id));
    setActiveMenuId(null);
  };

  if (!post) return <div style={{ padding: "40px" }}>로딩 중...</div>;

  return (
    <div
      style={{
        padding: "40px",
        fontFamily: "Arial, sans-serif",
        minHeight: "100vh",
        minWidth: "80vw",
        backgroundColor: "#fff",
      }}
    >
      {/* 상단바 */}
      <header
        style={{
          width: "100%",
          backgroundColor: "#2b2d42",
          color: "white",
          padding: "18px 40px",
          fontSize: "18px",
          fontWeight: "bold",
          marginBottom: "80px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        자유 게시판
        <button
          onClick={() => navigate("/")}
          style={{
            padding: "8px 16px",
            fontSize: "14px",
            backgroundColor: "white",
            color: "#2b2d42",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          홈으로
        </button>
      </header>

      {/* 제목 + 삭제 버튼 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 30px",
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

      {/* 작성자/날짜 정보 */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          color: "#555",
          fontSize: "14px",
          marginBottom: "40px",
          padding: "0 30px",
        }}
      >
        <div>작성자: {post.author}</div>
        <div>작성일: {new Date(post.date).toLocaleDateString()}</div>
      </div>

      {/* 본문 */}
      <div
        style={{
          fontSize: "16px",
          lineHeight: "1.6",
          marginBottom: "50px",
          textAlign: "left",
          padding: "0 30px",
        }}
      >
        {post.content}
      </div>

{/* ✅ 댓글 영역 */}
      <CommentSection />

      {/* 목록으로 돌아가기 */}
      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={() => navigate("/community")}
          style={{
            padding: "8px 16px",
            backgroundColor: "#ccc",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          목록으로 돌아가기
        </button>
      </div>
    </div>
  );
}

export default PostDetail;
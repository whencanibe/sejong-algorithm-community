import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import CommentSection from "../pages/commentsection";
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';

function PostDetail({ postId }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [userInfo, setUserInfo] = useState(null); // ✅ 로그인 유저 정보



  // 게시글 조회
  useEffect(() => {
    axios
      .get(`http://localhost:4000/posts/${id}`)
      .then((res) => setPost(res.data))
      .catch((err) => console.error("글 불러오기 실패:", err));
  }, [id]);

 
  useEffect(() => {
  axios
    .get("http://localhost:4000/info/api/mypage", {
      withCredentials: true,
    })
    .then((res) => {
      const { id, name } = res.data; // ✨ 필요한 것만 꺼냄
      setUserInfo({ id, name });     // ✅ 댓글 등 다른 컴포넌트에 넘길 값
    })
    .catch((err) => {
      console.error("유저 정보 불러오기 실패:", err);
    });
}, []);




  const handleDeletePost = async () => {
    const confirm = window.confirm("정말 이 글을 삭제하시겠습니까?");
    if (!confirm) return;

    try {
      await axios.delete(`http://localhost:4000/posts/${id}`, { withCredentials: true });
      alert("글이 삭제되었습니다.");
      navigate("/community");
    } catch (err) {
      console.error("삭제 실패:", err);
      alert("글 삭제 중 오류가 발생했습니다.");
    }
  };

  if (!post) return <div style={{ padding: "40px", color: "#fff" }}>로딩 중...</div>;

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#0d1117",
        color: "#fff",
        minHeight: "100vh",
        width: "100%",
        overflowX: "hidden",
        marginTop: "50px",
      }}
    >
      {/* 상단바 */}
      <header
        style={{
          width: "100%",
          backgroundColor: "#121826",
          color: "#b3e5fc",
          padding: "18px 40px",
          fontSize: "18px",
          fontWeight: "bold",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxSizing: "border-box",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 1000,
          boxShadow: "0 2px 10px #00e5ff55",
        }}
      >
        자유 게시판
        <button
          onClick={() => (window.location.href = "/home")}
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

      {/* 본문 */}
      <main
        style={{
          width: "100%",
          minHeight: "100vh",
          backgroundColor: "#0d1117",
          color: "#fff",
          padding: "40px 0",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            minWidth: "1200px",
            margin: "0 auto",
            padding: "0 20px",
            boxSizing: "border-box",
          }}
        >
          {/* 제목 + 삭제 버튼 */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "40px",
            }}
          >
            <h2 style={{ margin: 0, fontSize: "28px", fontWeight: "bold" }}>
              {post.title}
            </h2>
            {userInfo?.id === post.postId && (
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
            )}
          </div>

          {/* 날짜 */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              fontSize: "14px",
              color: "#ccc",
              marginBottom: "50px",
            }}
          >
           
            <div>
              작성일:{" "}
{post.createdAt
  ? new Date(post.createdAt).toLocaleDateString()
  : "알 수 없음"}

            </div>
          </div>

          {/* 본문 내용 */}
          <div
            style={{
              fontSize: "16px",
              lineHeight: "1.6",
              marginBottom: "150px",
              whiteSpace: "pre-wrap",
              color: "#fff",
              textAlign: "left",
            }}
          >
            {post.content}
          </div>

          {/* 코드 영역 */}
          {post.code && (
            <div style={{ marginBottom: "100px" }}>
              <h3
                style={{
                  color: "#00e5ff",
                  marginBottom: "12px",
                  fontSize: "18px",
                  textAlign: "left",
                }}
              >
                📄 첨부 코드
              </h3>
              <CodeMirror
                value={post.code}
                height="200px"
                extensions={[javascript()]}
                theme="dark"
                editable={false}
                className="custom-codemirror"
                style={{ borderRadius: "8px", overflow: "hidden" }}
              />
            </div>
          )}

          {/* 구분선 */}
          <hr
            style={{
              border: "none",
              borderTop: "1px solid #444",
              margin: "60px 0",
            }}
          />

          {post && userInfo && (
  <CommentSection postId={post.id} userInfo={userInfo} />
)}


          {/* 목록으로 */}
          <div style={{ marginTop: "40px", textAlign: "right" }}>
            <button
              onClick={() => navigate("/community")}
              style={{
                padding: "10px 16px",
                backgroundColor: "#3a3f58",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              목록으로 돌아가기
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default PostDetail;

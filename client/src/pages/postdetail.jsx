import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";

function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // 임시 게시글 데이터
  const post = {
    id,
    title: `${id}번 글의 제목입니다.`,
    author: "학생1",
    date: "2024-05-10",
    content: "이건 게시글 내용입니다. 여기에 글 본문이 들어갑니다.",
  };

  const [comments, setComments] = useState([]);
  const [input, setInput] = useState("");
  const [activeMenuId, setActiveMenuId] = useState(null); // ... 메뉴 열림 여부

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
        c.id === id
          ? { ...c, text: newText, isEditing: false, edited: true }
          : c
      )
    );
  };

const handleDelete = (id) => {
  setComments((prev) => prev.filter((c) => c.id !== id));
  setActiveMenuId(null);
};

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
          boxSizing: "border-box",
        }}
      >
        자유 게시판
        <button
          onClick={() => (window.location.href = "/")}
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

      {/* 제목 */}
      <h2 style={{ marginBottom: "40px", textAlign: "left", padding: "0 20px" }}>{post.title}</h2>

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
        <div>작성일: {post.date}</div>
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

      {/* 댓글 타이틀 */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
          padding: "0 30px",
        }}
      >
        <div style={{ fontSize: "18px", fontWeight: "bold" }}>댓글</div>
      </div>

      {/* 댓글 리스트 */}
      <ul style={{ listStyle: "none", paddingLeft: 0 }}>
        {comments.map((c) => (
          <li
            key={c.id}
            style={{
              display: "flex",
              alignItems: "flex-start",
              marginBottom: "16px",
              maxWidth: "70%",
              textAlign: "left",
              padding: "0 30px",
            }}
          >
            {/* 프로필 */}
            <div
              style={{
                width: "35px",
                height: "35px",
                borderRadius: "50%",
                backgroundColor: "#ccc",
                marginRight: "12px",
                flexShrink: 0,
              }}
            ></div>

            {/* 본문 */}
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontWeight: "bold",
                  marginBottom: "4px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>{c.nickname}</span>

                {/* 점 세 개 버튼 */}
                <div style={{ position: "relative",marginLeft: "auto" }}>
                  <button
                    onClick={() => setActiveMenuId(activeMenuId === c.id ? null : c.id)}
                    style={{
                      background: "none",
                      justifyContent: "space-between",
                      border: "none",
                      fontSize: "18px",
                      cursor: "pointer",
                      padding: "0 4px",
                      color: "#000",
                      
                    }}
                  >
                    ...
                  </button>

                  {/* 메뉴 드롭다운 */}
                  {activeMenuId === c.id && (
                    <div
                      style={{
                        position: "absolute",
                        right: 0,
                        top: "100%",
                        background: "#fff",
                        border: "1px solid #ddd",
                        borderRadius: "4px",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                        zIndex: 10,
                      }}
                    >
                      <button
                        onClick={() => handleEditStart(c.id)}
                        style={{
                          padding: "6px 12px",
                          fontSize: "14px",
                          cursor: "pointer",
                          background: "none",
                          border: "none",
                          width: "100%",
                          textAlign: "left",
                        }}
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        style={{
                          padding: "6px 12px",
                          fontSize: "14px",
                          cursor: "pointer",
                          background: "none",
                          border: "none",
                          width: "100%",
                          textAlign: "left",
                          color: "red",
                        }}
                      >
                        삭제
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* 댓글 내용 or 수정 입력 */}
              {c.isEditing ? (
                <CommentEditor id={c.id} initial={c.text} onSubmit={handleEditSubmit} />
              ) : (
                <>
                  <div style={{ lineHeight: "1.5", color: "#333" }}>{c.text}</div>
                  {c.edited && <div style={{ fontSize: "12px", color: "#888" }}>수정됨</div>}
                </>
              )}
            </div>
          </li>
        ))}
      </ul>

      {/* 댓글 입력창 */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="댓글을 입력하세요"
          style={{
            padding: "8px",
            width: "70%",
            marginRight: "8px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
        <button
          onClick={handleAddComment}
          style={{
            padding: "8px 16px",
            backgroundColor: "#2b2d42",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            marginBottom: "50px",
          }}
        >
          댓글 쓰기
        </button>
      </div>

      {/* 목록으로 돌아가기 버튼 */}
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

// 댓글 수정 인풋 컴포넌트
function CommentEditor({ id, initial, onSubmit }) {
  const [editInput, setEditInput] = useState(initial);

  return (
    <div style={{ marginTop: "8px" }}>
      <input
        value={editInput}
        onChange={(e) => setEditInput(e.target.value)}
        style={{
          padding: "6px",
          border: "1px solid #ccc",
          borderRadius: "4px",
          width: "60%",
          marginRight: "8px",
        }}
      />
      <button
        onClick={() => onSubmit(id, editInput)}
        style={{
          padding: "6px 12px",
          backgroundColor: "#2b2d42",
          color: "white",
          border: "none",
          borderRadius: "3px",
          cursor: "pointer",
        }}
      >
        수정 완료
      </button>
    </div>
  );
}

export default PostDetail;

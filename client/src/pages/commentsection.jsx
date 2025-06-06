import { useState, useEffect } from "react";
import axios from "axios";

function CommentSection({ postId, userInfo }) {
  const [comments, setComments] = useState([]);
  const [input, setInput] = useState("");
  const [activeMenuId, setActiveMenuId] = useState(null);

  useEffect(() => {
    // 📌 댓글 목록 불러오기
    const fetchComments = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/comments/${postId}`);
        setComments(res.data);
      } catch (err) {
        console.error("댓글 불러오기 실패:", err);
      }
    };
    fetchComments();
  }, [postId]);

  // 📌 댓글 추가
  const handleAddComment = async () => {
    if (input.trim() === "") return;

    try {
      await axios.post(
        `http://localhost:4000/comments/${postId}`,
        { text: input },
        { withCredentials: true }
      );

      const res = await axios.get(`http://localhost:4000/comments/${postId}`);
      setComments(res.data);
      setInput("");
    } catch (err) {
      console.error("댓글 저장 실패:", err.response?.data || err.message);
      alert("댓글 저장 중 오류 발생!");
    }
  };

  // 📌 댓글 수정 시작
  const handleEditStart = (id) => {
    setComments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isEditing: true } : c))
    );
    setActiveMenuId(null);
  };

  // 📌 댓글 수정 제출
  const handleEditSubmit = async (id, newText) => {
    try {
      await axios.put(
        `http://localhost:4000/comments/${id}`,
        { text: newText },
        { withCredentials: true }
      );

      const res = await axios.get(`http://localhost:4000/comments/${postId}`);
      setComments(res.data);
    } catch (err) {
      console.error("댓글 수정 실패:", err.response?.data || err.message);
      alert("댓글 수정 중 오류 발생!");
    }
  };

  // 📌 댓글 삭제
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/comments/${id}`, {
        withCredentials: true,
      });

      const res = await axios.get(`http://localhost:4000/comments/${postId}`);
      setComments(res.data);
    } catch (err) {
      console.error("댓글 삭제 실패:", err.response?.data || err.message);
      alert("댓글 삭제 중 오류 발생!");
    }

    setActiveMenuId(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // 줄바꿈 막기
      handleAddComment();
    }
  };


  return (
    <div>
      {/* ✅ 헤더 */}
      <div style={{
        fontSize: "25px",
        fontWeight: "bold",
        marginBottom: "50px",
        padding: "0 30px",
        textAlign: "left",
      }}>
        댓글
      </div>

      {/* ✅ 댓글 리스트 */}
      <ul style={{ listStyle: "none", paddingLeft: 10, marginBottom:"50px", }}>
        {comments.map((c) => (
          <li key={c.id} style={{
            display: "flex",
            alignItems: "flex-start",
            marginBottom: "16px",
            maxWidth: "70%",
            textAlign: "left",
            padding: "0 30px",
          }}>
            
            {/* 🔹 댓글 본문 */}
            <div style={{ flex: 1 }}>
              <div style={{
                fontWeight: "bold",
                marginBottom: "8px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}>
                {/* 🔸 유저 이름 */}
                <span style={{
                  border: "1px solid #00e5ff",
                  padding: "4px 8px",
                  borderRadius: "8px",
                  color: "#00e5ff",
                  fontWeight: "bold",
                  fontSize: "14px",
                  backgroundColor: "#0d1117",
                }}>
                  {c.user?.name || "익명"}
                </span>

                {/* 🔸 수정/삭제 메뉴 버튼 */}
                <div style={{ position: "relative", marginLeft: "auto", marginRight: "10px" }}>
                  { userInfo?.id === c.user?.id &&(
                    <button
                      onClick={() => setActiveMenuId(activeMenuId === c.id ? null : c.id)}
                      style={{
                        background: "none",
                        border: "none",
                        fontSize: "18px",
                        cursor: "pointer",
                        padding: "0 4px",
                        color: "#fff",
                      }}
                    >
                      ...
                    </button>
                  )}

                  {/* 🔸 메뉴 열렸을 때 */}
                  {activeMenuId === c.id && userInfo?.id === c.user?.id && (
                    <div style={{
                      position: "absolute",
                      right: 0,
                      top: "100%",
                      background: "#fff",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                      zIndex: 10,
                      minWidth: "50px", 
                    }}>
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

              {/* 🔹 댓글 텍스트 or 수정창 */}
              {c.isEditing ? (
                <CommentEditor id={c.id} initial={c.text} onSubmit={handleEditSubmit} />
              ) : (
                <>
                  <div style={{ lineHeight: "1.6", color: "#fff", fontSize: "15px" }}>
                    
                    {c.text}
                  </div>
                  {c.edited && (
                    <div style={{ fontSize: "12px", color: "#fff" }}>수정됨</div>
                  )}
                </>
              )}
            </div>
          </li>
        ))}
      </ul>

      {/* ✅ 댓글 입력창 */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          value={input}
          onKeyDown={handleKeyDown}
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
            padding: '10px 20px',
            fontSize: '14px',
            backgroundColor: '#afefff',
            color: 'black',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            boxShadow: "0 0 6px #00e5ff", 
            marginLeft:"20px",
            fontWeight: "bold",
          }}
        >
          댓글 쓰기
        </button>
      </div>
    </div>
  );
}

// 🔧 수정 시 나오는 입력창
function CommentEditor({ id, initial, onSubmit }) {
  const [editInput, setEditInput] = useState(initial);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSubmit(id, editInput); // ✅ 이 댓글만 수정 완료
    }
  };

  return (
    <div style={{ marginTop: "8px" }}>
      <input
        value={editInput}
        onKeyDown={handleKeyDown} 
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
            padding: '10px 20px',
            fontSize: '14px',
            backgroundColor: '#afefff',
            color: 'black',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            boxShadow: "0 0 6px #00e5ff", 
            marginLeft:"20px",
            fontWeight: "bold",
          }}
      >
        수정 완료
      </button>
    </div>
  );
}

export default CommentSection;


import { useState,useEffect } from "react";

function CommentSection({ postId, userInfo }) {
  const [comments, setComments] = useState([]);
  const [input, setInput] = useState("");
  const [activeMenuId, setActiveMenuId] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/api/comments/${postId}`);
        setComments(res.data); // [{ id, user: { name }, text }]
      } catch (err) {
        console.error("댓글 불러오기 실패:", err);
      }
    };
    fetchComments();
  }, [postId]);



  const handleAddComment = async () => {
    if (input.trim() === "") return;

    try {
       await axios.post(`http://localhost:4000/api/comments/${postId}`, {
        postId: postId,
        userId: userInfo.id,
        text: input,
      }, {
        withCredentials: true,
      });

      setComments([
        ...comments,
        {
          id: Date.now(),
          nickname: userInfo.name,
          text: input,
          isEditing: false,
          edited: false,
        },
      ]);
       const res = await axios.get(`http://localhost:4000/api/comments/${postId}`);
      setComments(res.data);
      setInput("");


    } catch (err) {
      console.error("댓글 저장 실패:", err);
      alert("댓글 저장 중 오류 발생!");
    }
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

  return (
    <div>
      <div
        style={{
          fontSize: "25px",
          fontWeight: "bold",
          marginBottom: "50px",
          padding: "0 30px",
           textAlign: "left", 
        }}
      >
        댓글
      </div>

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
                <span>{c.user?.name || "익명"}</span>

                <div style={{ position: "relative", marginLeft: "auto" }}>
                  <button
                    onClick={() =>
                      setActiveMenuId(activeMenuId === c.id ? null : c.id)
                    }
                    style={{
                      background: "none",
                      border: "none",
                      fontSize: "18px",
                      cursor: "pointer",
                      padding: "0 4px",
                      color: "#000",
                    }}
                  >
                    ...
                  </button>

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

              {c.isEditing ? (
                <CommentEditor id={c.id} initial={c.text} onSubmit={handleEditSubmit} />
              ) : (
                <>
                  <div style={{ lineHeight: "1.5", color: "#333" }}>{c.text}</div>
                  {c.edited && (
                    <div style={{ fontSize: "12px", color: "#888" }}>수정됨</div>
                  )}
                </>
              )}
            </div>
          </li>
        ))}
      </ul>

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
    </div>
  );
}

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

export default CommentSection;

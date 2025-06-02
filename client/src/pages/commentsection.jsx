
import { useState,useEffect } from "react";
import axios from "axios";

function CommentSection({ postId, userInfo }) {
  const [comments, setComments] = useState([]);
  const [input, setInput] = useState("");
  const [activeMenuId, setActiveMenuId] = useState(null);


  
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/comments/${postId}`);
        setComments(res.data); // [{ id, user: { name }, text }]
      } catch (err) {
        console.log("postId:", postId);
        console.error("댓글 불러오기 실패:", err);
      }
    };
    fetchComments();
  }, [postId]);


  
  
  const handleAddComment = async () => {
  if (input.trim() === "") return;

  console.log("postId", postId);
console.log("userId", userInfo?.id);

  try {
    await axios.post(`http://localhost:4000/comments/${postId}`, {
      userId: userInfo.id,
      text: input,
    }, {
      withCredentials: true,
    });

    // 최신 댓글 목록 다시 불러오기
    const res = await axios.get(`http://localhost:4000/comments/${postId}`);
    setComments(res.data);
    setInput("");
  } catch (err) {
    console.error("댓글 저장 실패:", err.response?.data || err.message);
    alert("댓글 저장 중 오류 발생!");
  }
};



  const handleEditStart = (id) => {
    setComments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isEditing: true } : c))
    );
    setActiveMenuId(null);
  };

  const handleEditSubmit = async (id, newText) => {
  try {
    await axios.put(`http://localhost:4000/comments/${id}`, {
      text: newText,
    }, {
      withCredentials: true,
    });

    // 업데이트 후 다시 불러오기
    const res = await axios.get(`http://localhost:4000/comments/${postId}`);
    setComments(res.data);
  } catch (err) {
    console.error("댓글 수정 실패:", err.response?.data || err.message);
    alert("댓글 수정 중 오류 발생!");
  }
};


 const handleDelete = async (id) => {
  try {
    await axios.delete(`http://localhost:4000/comments/${id}`, {
      withCredentials: true,
    });

    // 삭제 후 다시 불러오기
    const res = await axios.get(`http://localhost:4000/comments/${postId}`);
    setComments(res.data);
  } catch (err) {
    console.error("댓글 삭제 실패:", err.response?.data || err.message);
    alert("댓글 삭제 중 오류 발생!");
  }

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

      <ul style={{ listStyle: "none", paddingLeft: 10 }}>
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
                marginRight: "25px",
                flexShrink: 0,
              }}
            ></div>

            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontWeight: "bold",
                  marginBottom: "8px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span
  style={{
    border: "1px solid #00e5ff",   // 네온색 테두리
    padding: "4px 8px",
    borderRadius: "8px",
    color: "#00e5ff",
    fontWeight: "bold",
    fontSize: "14px",
    backgroundColor: "#0d1117", // 배경 어두운 톤
  }}
>
  {c.user?.name || "익명"}
</span>


                <div style={{ position: "relative", marginLeft: "auto", marginRight: "10px" }}>
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
                      color: "#fff",
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

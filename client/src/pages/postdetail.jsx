
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

  const handleAddComment = () => {
    if (input.trim() === "") return;
    const newComment = {
      id: Date.now(),
      nickname: "익명", // 나중에 유저 연동 시 변경 가능
      text: input,
    };
    setComments([...comments, newComment]);
    setInput("");
  };

  return (
    <div
      style={{
        padding: "40px",
        fontFamily: "Arial, sans-serif",
        minHeight: "100vh",
        minWidth : "80vw",
        backgroundColor: "#fff",
      }}
    >
    
    {/* 상단바 */}
    <header
        style={{
          width: '100%',
          backgroundColor: '#2b2d42',
          color: 'white',
          padding: '18px 40px',
          fontSize: '18px',
          fontWeight: 'bold',
          marginBottom: '80px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxSizing: 'border-box',
        }}
      >
        자유 게시판
        <button
          onClick={() => (window.location.href = '/home')}
          style={{
            padding: '8px 16px',
            fontSize: '14px',
            backgroundColor: 'white',
            color: '#2b2d42',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          홈으로
        </button>
      </header>


      {/* 제목 */}
      <h2 style={{ marginBottom: "40px", textAlign:"left",padding : "0 20px", }}>{post.title}</h2>

      {/* 작성자/날짜 정보 */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          color: "#555",
          fontSize: "14px",
          marginBottom: "40px",
          padding : "0 30px",
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
          padding : "0 30px",
        }}
      >
        {post.content}
      </div>

      {/* 댓글 입력창 + 목록으로 버튼 */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
          padding : "0 30px",
        }}
      >
        <div style={{ fontSize: "18px", fontWeight: "bold", }}>댓글</div>
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
              textAlign : "left",
              padding : "0 30px",
              alignItems: "center",
            }}
          >
            {/* 프로필 박스 */}
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

            {/* 닉네임 + 내용 */}
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: "bold", marginBottom: "4px" }}>
                {c.nickname}
              </div>
              <div style={{ lineHeight: "1.5", color: "#333" }}>{c.text}</div>
            </div>
          </li>
        ))}
      </ul>

      {/* 댓글 입력 */}
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
            marginBottom : "50px",
          }}
        >
          댓글 쓰기
        </button>
      </div>

       {/* 댓글 입력 */}
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

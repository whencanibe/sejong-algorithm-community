import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Community() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);

  // 게시글 목록 받아오기
  useEffect(() => {
  const fetchData = async () => {
    try {
      // 1단계: 세션 유효성 확인
      await axios.post("http://localhost:4000/info/api/refresh", {}, {
        withCredentials: true,
      });
    } catch (err) {
      // 세션 만료 → 로그인 필요
      alert("로그인이 필요합니다.");
      navigate("/login");
      return; // 아래 코드 실행하지 않도록 종료
    }

    try {
      // 2단계: 게시글 목록 요청
      const res = await axios.get("http://localhost:4000/posts");
      console.log("✅ 받아온 게시글:", res.data);
      setPosts(res.data);
    } catch (err) {
      console.error("❌ 게시글 불러오기 실패:", err);
    }
  };

  fetchData();
}, []);


  
  return (
    <div
      style={{
        fontFamily: 'Arial, sans-serif',
        backgroundColor: "#0d1117",
        minHeight: '100vh',
        boxSizing: 'border-box',
        paddingTop: '80px', // 헤더 공간 확보
        color: '#e0f7fa',
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
          boxShadow: "0 2px 10px #00e5ff55"
        }}
      >
        자유 게시판
        <button
          onClick={() => (window.location.href = '/')}
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

      {/* 글쓰기 버튼 */}
      <div style={{ textAlign: 'right', padding: '20px 40px' }}>
        <button
          onClick={() => navigate('/community/writepost')}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#2b2d42',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          글쓰기
        </button>
      </div>

      {/* 게시글 테이블 */}
      <div style={{ padding: '0 40px' }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            tableLayout: "fixed",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f1f1f1", textAlign: "center",color :"black", }}>
              <th style={{ padding: "12px", borderBottom: "2px solid #ccc" }}>제목</th>
              <th style={{ padding: "12px", borderBottom: "2px solid #ccc" }}>작성자</th>
              <th style={{ padding: "12px", borderBottom: "2px solid #ccc" }}>날짜</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id}>
                <td
                  onClick={() => navigate(`/community/postdetail/${post.id}`)}
                  style={{
                    padding: "12px",
                    borderBottom: "1px solid #eee",
                    cursor: "pointer",
                    color: "#fff",
                  }}
                >
                  {post.title}
                </td>
                <td style={{ padding: "12px", borderBottom: "1px solid #eee", color: "#ccc" }}>
                  {post.author || "익명"}
                </td>
                <td style={{ padding: "12px", borderBottom: "1px solid #eee", color: "#ccc" }}>
  {post.createdAt?.split("T")[0]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Community;

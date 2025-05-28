import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Community() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);

  // 게시글 목록 받아오기
  useEffect(() => {
    axios.get('http://localhost:4000/posts') // 백엔드 API 주소
      .then((res) => {
         console.log('✅ 받아온 게시글:', res.data); 
        setPosts(res.data); // 응답 데이터를 상태에 저장
      })
      .catch((err) => {
        console.error('게시글 불러오기 실패:', err);
      });
  }, []);

  return (
    <div
  style={{
    fontFamily: 'Arial, sans-serif',
    backgroundColor: "#0d1117",
    padding: '90px 20px 40px', // ✅ 상단 여백 + 좌우 여백
    backgroundColor: '#fff',
    boxSizing: 'border-box',
    minHeight: '100vh',        // 빈 공간 대비
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

  {/* 본문 */}
  <main
    style={{
      width: '100%',
     
      padding: '0 40px 40px',
      boxSizing: 'border-box',
      overflowY: 'auto',
    }}
  >
    <div style={{ textAlign: 'right', margin: '20px 0' }}>
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
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
     <thead>
  <tr style={{ backgroundColor: '#f1f1f1', textAlign: 'left' }}>
    <th style={{ width: '60%', padding: '12px', borderBottom: '2px solid #ccc' }}>제목</th>
    <th style={{ width: '20%', padding: '12px', borderBottom: '2px solid #ccc' }}>작성자</th>
    <th style={{ width: '20%', padding: '12px', borderBottom: '2px solid #ccc' }}>날짜</th>
  </tr>
</thead>

      <tbody>
        {posts.map((post) => (
          <tr key={post.id}>
            <td
              onClick={() => navigate(`/community/postdetail/${post.id}`)}
              style={{
                padding: '12px',
                borderBottom: '1px solid #eee',
                cursor: 'pointer',
                color: '#2b2d42',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#495057';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#2b2d42';
              }}
            >
              {post.title}
            </td>
            <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
              {post.author || '익명'}
            </td>
            <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
              {post.date?.split('T')[0]}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </main>
</div>

  );
}

export default Community;

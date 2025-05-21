
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Community() {
  const navigate = useNavigate();

  const [posts, setPosts] = useState([
    { id: 1, title: '세번째 글', author: '학생1', date: '2024-05-10' },
    { id: 2, title: '두 번째 글', author: '학생2', date: '2024-05-09' },
    { id: 3, title: '첫번째 글', author: '학생3', date: '2024-05-08' },
  ]);

  return (
    <div
      style={{
        fontFamily: 'Arial, sans-serif',
        minHeight: '100vh',
        minWidth: '80vw',
        overflowX: 'hidden',
        backgroundColor: '#fff',
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
          marginBottom: '40px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxSizing: 'border-box',
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

      {/* 본문 */}
      <main
        style={{
          width: '100%',
          padding: '0 40px 40px',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            textAlign: 'right',
            marginBottom: '20px',
          }}
        >
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
              <th style={{ padding: '10px', borderBottom: '2px solid #ccc' }}>제목</th>
              <th style={{ padding: '10px', borderBottom: '2px solid #ccc' }}>작성자</th>
              <th style={{ padding: '10px', borderBottom: '2px solid #ccc' }}>날짜</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id}>
                <td
                  onClick={() => navigate(`/community/postdetail/${post.id}`)}
                  style={{
                    padding: '10px',
                    borderBottom: '1px solid #eee',
                    cursor: 'pointer',
                    color: '#2b2d42',
                   
                    transition: 'background-color 0.2s',
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
                <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{post.author}</td>
                <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{post.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}

export default Community;

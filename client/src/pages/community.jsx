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
      await axios.get("http://localhost:4000/info/api/basicprofile", {
        withCredentials: true,
      });
    } catch (err) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
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
    <div>

      {/* 랜덤 배치된 배경 별 이미지들 */}

      <img src="/public/배경/star1.png" className="twinkle" style={{ position: "absolute", top: "782px", left: "309px", width: "26px", zIndex: 0 }} alt="star" />
      <img src="/public/배경/star1.png" className="twinkle" style={{ position: "absolute", top: "460px", left: "1285px", width: "25px", zIndex: 0 }} alt="star" />
      <img src="/public/배경/star1.png" className="twinkle" style={{ position: "absolute", top: "585px", left: "1419px", width: "28px", zIndex: 0 }} alt="star" />
      <img src="/public/배경/star1.png" className="twinkle" style={{ position: "absolute", top: "145px", left: "355px", width: "34px", zIndex: 0 }} alt="star" />
      <img src="/public/배경/star1.png" className="twinkle" style={{ position: "absolute", top: "508px", left: "1062px", width: "37px", zIndex: 0 }} alt="star" />
      <img src="/public/배경/star1.png" className="twinkle" style={{ position: "absolute", top: "457px", left: "880px", width: "21px", zIndex: 0 }} alt="star" />
      <img src="/public/배경/star1.png" className="twinkle" style={{ position: "absolute", top: "266px", left: "1372px", width: "20px", zIndex: 0 }} alt="star" />
      <img src="/public/배경/star1.png" className="twinkle" style={{ position: "absolute", top: "362px", left: "640px", width: "20px", zIndex: 0 }} alt="star" />
      <img src="/public/배경/star1.png" className="twinkle" style={{ position: "absolute", top: "650px", left: "388px", width: "27px", zIndex: 0 }} alt="star" />
      <img src="/public/배경/star1.png" className="twinkle" style={{ position: "absolute", top: "764px", left: "145px", width: "36px", zIndex: 0 }} alt="star" />
      <img src="/public/배경/star1.png" className="twinkle" style={{ position: "absolute", top: "205px", left: "1020px", width: "27px", zIndex: 0 }} alt="star" />
      <img src="/public/배경/star1.png" className="twinkle" style={{ position: "absolute", top: "29px", left: "1362px", width: "24px", zIndex: 0 }} alt="star" />
      <img src="/public/배경/star1.png" className="twinkle" style={{ position: "absolute", top: "781px", left: "1177px", width: "26px", zIndex: 0 }} alt="star" />
      <img src="/public/배경/star1.png" className="twinkle" style={{ position: "absolute", top: "800px", left: "115px", width: "21px", zIndex: 0 }} alt="star" />
      <img src="/public/배경/star1.png" className="twinkle" style={{ position: "absolute", top: "701px", left: "291px", width: "39px", zIndex: 0 }} alt="star" />
      <img src="/public/배경/star1.png" className="twinkle" style={{ position: "absolute", top: "403px", left: "1039px", width: "20px", zIndex: 0 }} alt="star" />
      <img src="/public/배경/star1.png" className="twinkle" style={{ position: "absolute", top: "336px", left: "1260px", width: "37px", zIndex: 0 }} alt="star" />
      <img src="/public/배경/star1.png" className="twinkle" style={{ position: "absolute", top: "181px", left: "273px", width: "25px", zIndex: 0 }} alt="star" />
      <img src="/public/배경/star1.png" className="twinkle" style={{ position: "absolute", top: "500px", left: "243px", width: "39px", zIndex: 0 }} alt="star" />

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
      {/* 고정 상단바 */}
      <header style={{
        position: "fixed", 
        top: 0, left: 0, 
        width: "100%",
        backgroundColor: "#0d1117", 
        color: "#afefff", 
        padding: "18px 40px",
        fontSize: "18px", 
        fontWeight: "bold", 
        display: "flex",
        justifyContent: "space-between", 
        alignItems: "center",
        borderBottom: "2px solid #00e5ff", 
        boxShadow: "0 2px 8px rgba(0, 229, 255, 0.15)",
        animation: "neonFlicker 1.5s infinite alternate", 
        zIndex: 1000
      }}>
        자유게시판
        <button onClick={() => (window.location.href = "/")} style={{
          padding: "8px 16px", 
          backgroundColor: "#afefff", 
          color: "#0d1117",
          border: "none", 
          borderRadius: "4px", 
          cursor: "pointer", 
          fontWeight: "bold",
          boxShadow: "0 0 10px #00e5ff", 
          fontSize: "14px",
          marginRight:"60px",
        }}>홈으로</button>
      </header>




      {/* 글쓰기 버튼 */}
      <div style={{ textAlign: 'right', padding: '20px 40px' }}>
        <button
          onClick={() => navigate('/community/writepost')}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#afefff',
            color: 'black',
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
                   {post.user?.name || "익명"}
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
  </div>
  );
}

export default Community;

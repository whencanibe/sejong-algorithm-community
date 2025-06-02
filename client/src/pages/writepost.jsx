import { useNavigate } from 'react-router-dom';
import { useState,useEffect } from 'react';
import axios from 'axios';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { githubLight } from '@uiw/codemirror-theme-github';

function WritePost() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [showCodeEditor, setShowCodeEditor] = useState(false);
  const [code, setCode] = useState('');

  const [userInfo, setUserInfo] = useState(null);
const [author, setAuthor] = useState("");

useEffect(() => {
  const fetchAuthor = async () => {
    try {
      const res = await axios.get("http://localhost:4000/info/api/mypage", {
        withCredentials: true,
      });
      setAuthor(res.data.name); // ← 닉네임
    } catch (err) {
      console.error("작성자 닉네임 가져오기 실패:", err);
      alert("로그인이 필요합니다.");
      navigate("/login");
    }
  };
  fetchAuthor();
}, []);


  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    console.log("✅ 보내는 데이터", { title, content, code });

    try {
      await axios.post('http://localhost:4000/posts', {
        title,
        content,
        code,
        
      }, { withCredentials: true });

      alert('글이 성공적으로 작성되었습니다!');
      navigate('/community');
    } catch (error) {
      console.error('글 작성 중 오류 발생:', error);
      alert('서버 오류로 인해 글 작성에 실패했습니다.');
    }
  };

  return (
    <div
      style={{
        fontFamily: 'Arial, sans-serif',
        width: '100%',
        minHeight: '100vh',
        backgroundColor: '#0d1117',
        color: '#fff',
        display: 'flex',

        paddingTop: '100px',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          width: '100%',
          minWidth: '1200px',
          padding: '0 40px 80px',
          boxSizing: 'border-box',
        }}
      >
        {/* 상단바 */}
<header
  style={{
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    backgroundColor: "#2a3142",
    color: "#e0f7fa",
    padding: "18px 40px",
    fontSize: "18px",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",  // 버튼은 오른쪽으로 밀기
    boxSizing: "border-box",
    borderBottom: "1px solid #00e5ff",
    boxShadow: "0 2px 8px rgba(0, 229, 255, 0.15)",
    animation: "neonFlicker 1.5s infinite alternate",
    zIndex: 1000,
  }}
>
  {/* 가운데 정렬용 박스 */}
  <div style={{ flex: 1, textAlign: "center", marginLeft: "80px" }}>
    <h3 style={{ margin: 0 }}>글 작성</h3>
  </div>

  {/* 오른쪽 버튼 */}
  <div>
    <button
      onClick={() => navigate('/community')}
      style={{
        padding: "8px 16px",
        fontSize: "14px",
        backgroundColor: "white",
        color: "#2a3142",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
      }}
    >
      글 목록으로
    </button>
  </div>
</header>

        {/* 제목 */}
        <div style={{ marginBottom: '25px', textAlign:"left", }}>
          <label style={{ display: 'block', fontWeight: 'bold', fontSize: '16px', marginBottom: '15px' }}>
            제목
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              width: '100%',
              padding: '14px',
              fontSize: '16px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              backgroundColor: '#fff',
              color: '#000',
            }}
          />
        </div>

        {/* 내용 */}
        <div style={{margintop :"30px", marginbottom:"50px" ,textAlign:"left", }}>
          <label style={{ display: 'block', fontWeight: 'bold', fontSize: '16px', marginBottom: '20px' }}>
            내용
          </label>
          <textarea
  value={content}
  onChange={(e) => setContent(e.target.value)}
  style={{
    width: '100%',
    height: '300px',
    padding: '14px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #00e5ff',
    backgroundColor: '#fff',
    color: '#000',
    boxShadow: '0 0 8px #00e5ff',
    animation: 'neonFlicker 1.5s infinite alternate',
  }}
/>

        </div>

        {/* 코드 추가 버튼 */}
        <div style={{ textAlign: 'right', marginTop:"40px", marginBottom: '30px' }}>
          <button
            onClick={() => setShowCodeEditor(!showCodeEditor)}
            style={{
              padding: '10px 20px',
              fontSize: '14px',
              backgroundColor: '#e0e0e0',
              color: '#333',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            {showCodeEditor ? '코드 숨기기' : '코드 추가'}
          </button>
        </div>

        {/* 코드 입력창 */}
        {showCodeEditor && (
          <div style={{ marginBottom: '40px',textAlign: "left", }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', }}>
              코드 입력
            </label>
            <CodeMirror
  value={code}
  height="200px"
  theme={githubLight}
  extensions={[javascript()]}
  onChange={(value) => setCode(value)}
  style={{
    borderRadius: '4px',
    border: '1px solid #00e5ff',
    boxShadow: '0 0 8px #00e5ff',
    animation: 'neonFlicker 1.5s infinite alternate',
  }}
/>

          </div>
        )}

        {/* 작성 완료 버튼 */}
        <div style={{ textAlign: 'right' }}>
          <button
            onClick={handleSubmit}
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              backgroundColor: '#2b2d42',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            작성 완료
          </button>
        </div>
      </div>
    </div>
  );
}

export default WritePost;

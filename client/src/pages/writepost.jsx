// 글 작성 페이지
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { githubLight } from '@uiw/codemirror-theme-github';

function WritePost() {
  const navigate = useNavigate();

  // 글 제목, 내용, 코드, 코드입력창 보이기 여부 상태
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [code, setCode] = useState('');
  const [showCodeEditor, setShowCodeEditor] = useState(false);

  // 사용자 닉네임 상태
  const [userInfo, setUserInfo] = useState(null);
  const [author, setAuthor] = useState("");

  // 로그인 확인 및 작성자 정보 불러오기
  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const res = await axios.get("http://localhost:4000/info/api/mypage", {
          withCredentials: true,
        });
        setAuthor(res.data.name); // 사용자 닉네임 설정
      } catch (err) {
        console.error("작성자 닉네임 가져오기 실패:", err);
        alert("로그인이 필요합니다.");
        navigate("/login");
      }
    };
    fetchAuthor();
  }, []);

  // 작성 완료 버튼 클릭 시 서버로 전송
  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

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
        {/* 상단 고정 헤더 */}
        <header style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          backgroundColor: '#0d1117',
          color: "#e0f7fa",
          padding: "18px 40px",
          fontSize: "18px",
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxSizing: "border-box",
          borderBottom: "2px solid #00e5ff",
          boxShadow: "0 2px 8px rgba(0, 229, 255, 0.15)",
          animation: "neonFlicker 1.5s infinite alternate",
          zIndex: 1000,
        }}>
          {/* 가운데 제목 */}
          <div style={{ flex: 1, textAlign: "center", marginLeft: "80px" }}>
            <h3 style={{ margin: 0 }}>글 작성</h3>
          </div>

          {/* 오른쪽 이동 버튼 */}
          <div>
            <button
              onClick={() => navigate('/community')}
              style={{
                padding: "8px 16px",
                backgroundColor: "#afefff",
                color: "#0d1117",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: "bold",
                boxShadow: "0 0 10px #00e5ff",
                fontSize: "14px",
              }}
            >
              글 목록으로
            </button>
          </div>
        </header>

        {/* 제목 입력란 */}
        <div style={{ color: "#afefff", marginBottom: '25px', textAlign: "left" }}>
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

        {/* 내용 입력란 */}
        <div style={{ color: "#afefff", textAlign: "left", marginBottom: "50px" }}>
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
        <div style={{ textAlign: 'right', marginTop: "40px", marginBottom: '30px' }}>
          <button
            onClick={() => setShowCodeEditor(!showCodeEditor)}
            style={{
              padding: '10px 20px',
              fontSize: '14px',
              backgroundColor: '#cfffff',
              color: '#333',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            {showCodeEditor ? '코드 숨기기' : '코드 추가'}
          </button>
        </div>

        {/* 코드 입력 영역 (CodeMirror) */}
        {showCodeEditor && (
          <div style={{ marginBottom: '40px', textAlign: "left" }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>
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
              backgroundColor: "white",
              color: '#0d1117',
              border: 'none',
              borderRadius: '5px',
              boxShadow: "0 4px 8px rgba(151, 167, 169, 0.15)",
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

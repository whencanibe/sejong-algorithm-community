import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
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
          maxWidth: '960px',
          padding: '0 40px 80px',
          boxSizing: 'border-box',
        }}
      >
        {/* 상단바 */}
        <header
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            backgroundColor: '#2b2d42',
            color: 'white',
            padding: '18px 80px',
            fontSize: '18px',
            fontWeight: 'bold',
            zIndex: 1000,
            boxSizing: 'border-box',
          }}
        >
          <h3 style={{ margin: 0 }}>글 작성</h3>
          <button
            onClick={() => navigate('/community')}
            style={{
              position: 'absolute',
              right: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              padding: '8px 16px',
              fontSize: '14px',
              backgroundColor: '#8d99ae',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            글 목록으로
          </button>
        </header>

        {/* 제목 */}
        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', fontSize: '16px', marginBottom: '8px' }}>
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
        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', fontSize: '16px', marginBottom: '8px' }}>
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
              border: '1px solid #ccc',
              resize: 'vertical',
              backgroundColor: '#fff',
              color: '#000',
            }}
          />
        </div>

        {/* 코드 추가 버튼 */}
        <div style={{ textAlign: 'right', marginBottom: '20px' }}>
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
          <div style={{ marginBottom: '40px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>
              코드 입력
            </label>
            <CodeMirror
              value={code}
              height="200px"
              theme={githubLight}
              extensions={[javascript()]}
              onChange={(value) => setCode(value)}
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

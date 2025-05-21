
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

// CodeMirror 관련 import
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { githubLight } from '@uiw/codemirror-theme-github';

function WritePost() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [showCodeEditor, setShowCodeEditor] = useState(false);
  const [code, setCode] = useState('');

  const handleSubmit = () => {
    if (!title || !content) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    alert(`제목: ${title}\n내용: ${content}\n코드: \n${code}`);
    navigate('/community');
  };

  return (
    <div
      style={{
        fontFamily: 'Arial, sans-serif',
        height: '100vh',
        width: '80vw',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#f8f9fa',
      }}
    >
      {/* 상단바 */}
      <header
        style={{
          backgroundColor: '#2b2d42',
          color: 'white',
          padding: '18px 80px',
          fontSize: '18px',
          fontWeight: 'bold',
        }}
      >
        <h3 style={{ margin: 0 }}>글 작성</h3>
      </header>

      {/* 글쓰기 영역 */}
      <div
        style={{
          padding: '20px 40px',
          overflowY: 'auto',
          boxSizing: 'border-box',
          width: '100%',
        }}
      >
        <div style={{ width: '100%' }}>
          {/* 제목 */}
          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', textAlign: 'left' }}>
              제목
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '16px',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* 내용 */}
          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', textAlign: 'left' }}>
              내용
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={15}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '16px',
                resize: 'vertical',
                boxSizing: 'border-box',
                height: '25vh',
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
                textAlign :"left",
              }}
            >
              {showCodeEditor ? '코드 숨기기' : '코드 추가'}
            </button>
          </div>

          {/* CodeMirror 코드 입력창 */}
          {showCodeEditor && (
            <div style={{ marginBottom: '40px', textAlign :"left" }}>
              <label style={{ display: 'block', fontWeight: 'bold', textAlign: 'left', marginBottom: '8px' }}>
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
    </div>
  );
}

export default WritePost;

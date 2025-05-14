import React, { useState } from 'react';

function MyPage() {
  const [profileImg, setProfileImg] = useState(`https://api.dicebear.com/7.x/bottts/svg?seed=${Date.now()}`);
  const [nickname, setNickname] = useState('수정');
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [nicknameError, setNicknameError] = useState(false); 

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImg(URL.createObjectURL(file));
    }
  };

  const handleNicknameSave = () => {
    if (!nickname.trim()) {
      setNicknameError(true); 
      return;
    }
    setIsEditingNickname(false);
    setNicknameError(false);
  };

  const commonBoxStyle = {
    width: '100%',
    padding: '10px 14px',
    backgroundColor: '#f9fafb',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '16px',
    lineHeight: '1.5',
    boxSizing: 'border-box',
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: '40px',
        backgroundColor: '#e5e7eb',
        minHeight: '100vh',
        width: '100vw',
      }}
    >
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: '12px',
          padding: '40px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
          maxWidth: '1000px',
          width: '100%',
        }}
      >
        <h1 style={{ marginBottom: '30px' }}>마이페이지</h1>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '40px', marginBottom: '30px' }}>
          {/* 프로필 이미지 */}
          <div style={{ position: 'relative', width: '160px', marginLeft: '50px' }}>
            <img
              src={profileImg}
              alt="프로필 이미지"
              style={{
                width: '160px',
                height: '160px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '1px solid #ccc',
              }}
            />
            <label
              htmlFor="profileInput"
              style={{
                position: 'absolute',
                bottom: '10px',
                left: '10px',
                background: '#fff',
                padding: '4px 8px',
                borderRadius: '6px',
                border: '1px solid #ddd',
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
              }}
            >
              ✏️ Edit
            </label>
            <input
              id="profileInput"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
          </div>

          {/* 아이디 + 닉네임 */}
          <div style={{ width: '500px' }}>
            {/* 아이디 */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>아이디</label>
              <div style={commonBoxStyle}>sojung22</div>
            </div>

            {/* 닉네임 */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>닉네임</label>
              <div style={{ position: 'relative' }}>
                {isEditingNickname ? (
                  <>
                    <input
                      value={nickname}
                      placeholder={nicknameError ? '하나 이상의 문자를 입력하세요' : ''}
                      onChange={(e) => {
                        setNickname(e.target.value);
                        if (nicknameError) setNicknameError(false);
                      }}
                      style={{
                        ...commonBoxStyle,
                        paddingRight: '60px',
                        color: nicknameError ? '#dc2626' : 'black',
                        borderColor: nicknameError ? '#fca5a5' : '#d1d5db',
                      }}
                    />
                    <button
                      onClick={handleNicknameSave}
                      style={{
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        fontSize: '14px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        padding: '4px 8px',
                        backgroundColor: '#f3f4f6',
                        cursor: 'pointer',
                      }}
                    >
                      저장
                    </button>
                  </>
                ) : (
                  <div style={{ ...commonBoxStyle, position: 'relative' }}>
                    {nickname}
                    <button
                      onClick={() => setIsEditingNickname(true)}
                      style={{
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        fontSize: '14px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        padding: '4px 8px',
                        backgroundColor: '#f3f4f6',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                    ✏️ Edit
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 기타 정보 */}
        <div style={{ marginLeft: '50px' }}>
          <p><strong>학과:</strong> 소프트웨어학과</p>
          <p><strong>학번:</strong> 22학번</p>
          <p><strong>학년:</strong> 3</p>
          <p><strong>백준 티어:</strong> 실버 3</p>
          <p><strong>세종대 내 백준 티어 랭킹:</strong> 3</p>
          <p><strong>학과 내 백준 티어 랭킹:</strong> 3</p>
          <p><strong>이번주에 푼 백준 문제:</strong> 12</p>
          <p><strong>세종대 내 이번주 백준 풀이 랭킹:</strong> 3</p>
          <p><strong>학과 내 이번주 백준 풀이 랭킹:</strong> 3</p>
          <p><strong>연속 풀이 일수:</strong> 4</p>
        </div>
      </div>
    </div>
  );
}

export default MyPage;

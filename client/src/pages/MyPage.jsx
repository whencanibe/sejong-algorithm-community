import React, { useState, useEffect } from 'react';
import axios from "axios";

function MyPage() {
  const [profileImg, setProfileImg] = useState(`https://api.dicebear.com/7.x/bottts/svg?seed=${Date.now()}`);
  const [nickname, setNickname] = useState('');
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [nicknameError, setNicknameError] = useState(false);

  // ✅ 추가: 사용자 정보 상태
  const [userInfo, setUserInfo] = useState({
    baekjoonName: '',
    name: '',
    department: '',
    enrollYear: '',
    tier: '',
    rank: 0,
    rankInDepartment: 0,
    streak: 0,
    percentile: 0,
    totalSolvedCount: 0,
  });

  
  // ✅ useEffect 내부 비동기 함수
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        // ✅ 1) 세션/쿠키 갱신 (refresh)
        await axios.post(`http://localhost:4000/info/api/refresh`, {}, {
          withCredentials: true, // 쿠키 포함!
        });
        
        const res = await axios.get(`http://localhost:4000/info/api/mypage`, {
          withCredentials: true, // ✅ 세션 쿠키 포함
        });
        setUserInfo(res.data);
        setNickname(res.data.name);
        setProfileImg(
          res.data.profileImage
            ? `http://localhost:4000${res.data.profileImage}`
            : `https://api.dicebear.com/7.x/bottts/svg?seed=${Date.now()}`
        );
      } catch (error) {
        console.error(error);
      }
    };
    fetchUserInfo();

  }, []);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    const formData = new FormData();
    formData.append("image", file);
  
    try {
      const res = await axios.post("http://localhost:4000/info/api/upload-profile", formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      // 서버가 반환한 URL을 상태에 저장
      const uploadedUrl = `http://localhost:4000${res.data.url}`;
      setProfileImg(uploadedUrl);
      setUserInfo((prev) => ({
        ...prev,
        profileImage: uploadedUrl,
      }));
    } catch (err) {
      console.error("이미지 업로드 실패:", err);
    }
  };

  const handleNicknameSave = () => {
    if (!nickname.trim()) {
      setNicknameError(true);
      return;
    }
    setIsEditingNickname(false);
    setNicknameError(false);

    // ✅ 서버에 닉네임 저장 요청 추가 (예: PUT 요청)
    // axios.put(`http://localhost:4000/info/api/mypage`, { name: nickname })
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

  if (!userInfo || !userInfo.baekjoonName) {
    return <div style={{ padding: "40px" }}>로딩 중...</div>;
  }

  return (
    <div
      style={{
        fontFamily: 'Arial, sans-serif',
        minHeight: '100vh',
        overflowX: 'hidden',
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
        마이페이지
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

      <div
        style={{
          maxWidth: '1000px',
          margin: '0 auto',
          padding: '0 5vw 40px',
          boxSizing: 'border-box',
        }}
      >
        <h1 style={{ marginBottom: '30px', textAlign: 'center' }}>👤 내 프로필</h1>

        {/* 프로필 이미지 + 정보 */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'flex-start',
            gap: '40px',
            marginBottom: '30px',
          }}
        >
          {/* 프로필 이미지 */}
          <div style={{ position: 'relative', width: '200px', minWidth: '200px' }}>
            <img
              src={profileImg}
              alt="프로필 이미지"
              style={{
                width: '200px',
                height: '200px',
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

          {/* 오른쪽: 아이디 + 닉네임 */}
          <div style={{ flexGrow: 1, minWidth: '250px' }}>
            {/* 아이디 */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>백준 아이디</label>
              <div style={commonBoxStyle}>{userInfo.baekjoonName}</div>
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

            {/* 기타 정보 */}
            <div
              style={{
                textAlign: 'left',
                marginTop: '30px',
                lineHeight: '1.8',
                paddingLeft: '5px',
              }}
            >
              <p><strong>학과:</strong> {userInfo.department}</p>
              <p><strong>학번:</strong> {userInfo.enrollYear}학번</p>
              <p><strong>티어:</strong> {userInfo.tier}</p>
              <p><strong>세종대 내 티어 랭킹:</strong> {userInfo.rank}</p>
              <p><strong>학과 내 티어 랭킹:</strong> {userInfo.rankInDepartment}</p>
              <p><strong>연속 풀이 일수:</strong> {userInfo.streak}</p>
              <p><strong>해결한 총 문제 수</strong> {userInfo.totalSolvedCount}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyPage;

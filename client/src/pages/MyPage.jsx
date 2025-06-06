import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import './MyPage.css';

const CACHE_KEY = "myPage:userInfo";
const CACHE_TTL = 1000 * 60 * 30;          // 30 분

//브라우저 localStorage에 저장된 userInfo 불러오는 함수
function loadCachedUserInfo() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { ts, data } = JSON.parse(raw);
    if (Date.now() - ts < CACHE_TTL) return data;   // 30분 안지났으면 HIT
  } catch (_) { }
  return null;
}
//브라우저 localStorage에 저장시키는 함수
function saveCachedUserInfo(data) {
  localStorage.setItem(
    CACHE_KEY,
    JSON.stringify({ ts: Date.now(), data })
  );
}
//브라우저 localStorage에 저장된 값 지우는 함수
function clearCachedUserInfo() {
  localStorage.removeItem(CACHE_KEY);
}

const toAbsolute = (url) =>
  !url ? "/기본이미지.png"
    : url.startsWith("http") ? url
      : `http://localhost:4000${url}`;

function MyPage() {
  const navigate = useNavigate();

  //localStrage에 있으면 불러오고 아니면 0 이나 ''로 초기화
  const [userInfo, setUserInfo] = useState(() => {
    return loadCachedUserInfo() ?? {
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
      profileImage: "",
    };
  });

  // 2) userInfo에서 파생되는 뷰 전용 상태
  const [profileImg, setProfileImg] = useState(() =>
    toAbsolute(userInfo.profileImage)          // 캐시 기반 초기값
  );
  const [nickname, setNickname] = useState(() => userInfo.name);
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [nicknameError, setNicknameError] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [refreshing, setRefreshing] = useState(false); // 프로필 새로고침 버튼 관련

  const fetchUserInfo = async () => {
    if (refreshing) return;          // 중복 클릭 방지
    setRefreshing(true);             // 새로고침 시작
    try {
      const res = await axios.get(`http://localhost:4000/info/api/mypage`, {
        withCredentials: true,
        validateStatus: s => s < 500 // 4xx 캐치로 안가도록
      });

      // 사용자 로그인 안했으면
      if (res.status === 401) {
        throw new Error("unauthorized"); // 로그인 안한 사용자와 네트워크 오류를 분리하기 위함
      }

      const defaultImg = "/기본이미지.png";
      const imageUrl = res.data.profileImage
        ? (res.data.profileImage.startsWith("http") ? res.data.profileImage : `http://localhost:4000${res.data.profileImage}`)
        : defaultImg;

      // 새로 합친 userInfo
      const merged = { ...res.data, profileImage: imageUrl };
      setProfileImg(imageUrl);
      setUserInfo(merged);
      //setIsLoggedIn(true);
      setNickname(merged.name);

      //localStorage 갱신
      saveCachedUserInfo(merged);
    } catch (error) {
      // 로그인 안했으면
      if (error.response?.status === 401 || error.message === "unauthorized") {
        clearCachedUserInfo();
        navigate("/login", { replace: true });
      } else { // 외부 API 호출 중 문제가 생겼다면
        console.error("프로필 로드 실패:", error);
        alert("외부 네트워크 오류입니다. 잠시 후에 다시 시도하세요.");
      }

    } finally {
      setRefreshing(false); // 새로고침 종료
    }
  };

  // 정보 상자 스타일
  const infoBoxStyle = {
    width: '220px',
    minWidth: '220px',
    border: '2px solid #00e5ff',
    borderRadius: '12px',
    padding: '16px',
    backgroundColor: '#1a1e2a',
    color: '#e0f7fa',
    textAlign: 'center',
    boxShadow: '0 0 12px rgba(0, 229, 255, 0.25)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  };

  // 레이블 스타일
  const labelStyle = {
    fontWeight: 'bold',
    fontSize: '17px',
    marginBottom: '8px',
  };

  // 구분선 스타일
  const separatorLineStyle = {
    borderBottom: '1px solid rgba(0, 229, 255, 0.4)',
    width: '95%',
    margin: '8px auto',
  };

  useEffect(() => {
    (async () => {
      try {
        // 서버가 세션 보고 200 또는 401을 돌려주는 엔드포인트
        await axios.get("http://localhost:4000/user/me", {
          withCredentials: true,
          validateStatus: s => s < 500            // 4xx도 catch 안 나게
        }).then(res => {
          if (res.status === 200) {
            setIsLoggedIn(true);                  // 로그인 인정
          } else {
            throw new Error("unauthorized");
          }
        });
      } catch {
        // 세션 만료 → 캐시 파기 → 로그인 페이지로
        clearCachedUserInfo();
        alert("로그인이 필요합니다.");
        navigate("/login", { replace: true });
      }
    })();
  }, [navigate]);

  useEffect(() => {
    if (!isLoggedIn) return;
    if (!loadCachedUserInfo()) fetchUserInfo(); // 캐시 없을때만 호출
  }, [isLoggedIn]);

  /* ---------- userInfo => 파생값 동기화 ---------- */
  useEffect(() => {
    setProfileImg(toAbsolute(userInfo.profileImage));
    setNickname(userInfo.name);
  }, [userInfo]);

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

      const uploadedUrl = `http://localhost:4000${res.data.url}`;
      setProfileImg(uploadedUrl);
      setUserInfo(prev => {
        const next = { ...prev, profileImage: uploadedUrl };
        saveCachedUserInfo(next);           //캐시에 추가
        return next;
      });
    } catch (err) {
      console.error("이미지 업로드 실패:", err);
    }
  };

  const handleNicknameSave = async () => {
    if (!nickname.trim()) {
      setNicknameError(true);
      return;
    }

    try {
      await axios.patch(
        `http://localhost:4000/info/api/change-nickname`,
        { name: nickname },
        { withCredentials: true }
      );

      setUserInfo(prev => {
        const next = { ...prev, name: nickname };
        saveCachedUserInfo(next);           // 캐시에 추가
        return next;
      });
      setIsEditingNickname(false);
      setNicknameError(false);
    } catch (err) {
      console.error("닉네임 수정 실패:", err.response?.data);
      console.log("상태 코드:", err.response?.status);

      if (err.response?.status === 400) {
        alert("이미 존재하는 닉네임입니다.");
      } else {
        alert("닉네임 수정에 실패했습니다.");
      }
    }
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
    color: 'black'
  };

  if (!userInfo.baekjoonName) {
  return (
    <div className="loading-screen">
      <span className="loader" />
      &nbsp;로딩 중...
    </div>
  );
}
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', minHeight: '100vh', overflowX: 'hidden' }}>
      {/* 고정 헤더 */}
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          backgroundColor: '#121826',
          color: '#b3e5fc',
          padding: '18px 40px',
          fontSize: '18px',
          fontWeight: 'bold',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxSizing: 'border-box',
          zIndex: 1000,
          boxShadow: '0 2px 10px #00e5ff55',
        }}
      >
        마이페이지
        <button
          onClick={() => (window.location.href = '/')}
          style={{
            padding: '8px 16px',
            fontSize: '14px',
            backgroundColor: '#afefff',
            color: '#0d1117',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
            boxShadow: '0 0 10px #00e5ff',
          }}
        >
          홈으로
        </button>
      </header>

      {/* 본문 */}
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '40px 5vw 40px',
        boxSizing: 'border-box'
      }}>
        <h1 style={{ marginBottom: '30px', textAlign: 'center', color: '#afefff' }}>⚙️ 내 프로필</h1>
        
        <button
          onClick={() => fetchUserInfo()}
          disabled={refreshing}
          style={{
            padding: '8px 16px',
            fontSize: '14px',
            backgroundColor: '#afefff',
            color: '#0d1117',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
            boxShadow: '0 0 10px #00e5ff',
            marginBottom: '7px',
            opacity: refreshing ? 0.6 : 1
          }}
        >
          {refreshing ? (
            <>
              <span className="loader" /> 새로고침 중...
            </>
          ) : (
            "프로필 정보 새로고침"
          )}
        </button>
        <div
          style={{
            border: '2px solid #00e5ff',
            borderRadius: '12px',
            padding: '32px',
            backgroundColor: '#1a1e2a',
            color: '#e0f7fa',
            boxShadow: '0 0 12px rgba(0, 229, 255, 0.25)',
            marginBottom: '30px',
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: '40px' }}>
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
              <label htmlFor="profileInput" style={{
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
                color: 'black'
              }}>
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

            <div style={{ flexGrow: 1, minWidth: '250px' }}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>백준 아이디</label>
                <div style={commonBoxStyle}>{userInfo.baekjoonName}</div>
              </div>

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
        </div>

        {/* 왼쪽 정렬 및 세로 겹침 없이 가로로만 겹치는 상자들 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '40px' }}>
          {/* 1행: 학과, 학번 */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {[
              { label: '학과', value: userInfo.department },
              { label: '학번', value: `${userInfo.enrollYear}학번` },
            ].map((item, idx) => (
              <div key={idx} style={{ ...infoBoxStyle, marginLeft: idx > 0 ? '-20px' : '0px' }}>
                <div style={labelStyle}>{item.label}</div>
                <div style={separatorLineStyle}></div> {/* 구분선 */}
                <div>{item.value}</div>
              </div>
            ))}
          </div>

          {/* 2행: 티어, 세종대 내 랭킹, 학과 내 랭킹 */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {[
              { label: '티어', value: userInfo.tier },
              { label: '세종대 내 랭킹', value: `${userInfo.rank}위` },
              { label: '학과 내 랭킹', value: `${userInfo.rankInDepartment}위` },
            ].map((item, idx) => (
              <div key={idx} style={{ ...infoBoxStyle, marginLeft: idx > 0 ? '-20px' : '0px' }}>
                <div style={labelStyle}>{item.label}</div>
                <div style={separatorLineStyle}></div> {/* 구분선 */}
                <div>{item.value}</div>
              </div>
            ))}
          </div>

          {/* 3행: 연속 풀이 일수, 총 푼 문제 수 */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {[
              { label: '연속 풀이 일수', value: `${userInfo.streak}일` },
              { label: '총 푼 문제 수', value: `${userInfo.totalSolvedCount}문제` },
            ].map((item, idx) => (
              <div key={idx} style={{ ...infoBoxStyle, marginLeft: idx > 0 ? '-20px' : '0px' }}>
                <div style={labelStyle}>{item.label}</div>
                <div style={separatorLineStyle}></div> {/* 구분선 */}
                <div>{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyPage;
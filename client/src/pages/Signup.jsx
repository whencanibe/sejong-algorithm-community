import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// 학과(전공) 목록
const departments = [
  "AI로봇학과",
  "AI연계융합전공",
  "AI융합전자공학과",
  "IT계열",
  "경상호텔관광계열",
  "경영학부",
  "경제학과",
  "공과계열",
  "교육학과",
  "국방시스템공학과",
  "국어국문학과",
  "국제학부",
  "국제통상전공",
  "국제협력전공",
  "금융보험애널리틱스 융합전공",
  "기계공학과",
  "기계공학전공",
  "나노신소재공학과",
  "뉴미디어퍼포먼스 융합전공",
  "대양휴머니티칼리지",
  "데이터사이언스학과",
  "디자인이노베이션전공",
  "만화애니메이션텍전공",
  "무용과",
  "무인이동체공학전공",
  "물리천문학과",
  "미디어커뮤니케이션학과",
  "반도체시스템공학과",
  "바이오산업자원공학전공",
  "바이오융합공학전공",
  "법학과",
  "법학부 법학전공",
  "비즈니스 애널리틱스 융합전공",
  "사이버국방학과",
  "생명시스템학부",
  "소셜미디어매니지먼트소프트웨어",
  "소프트웨어학과",
  "스마트기기공학전공",
  "스마트생명산업융합학과",
  "스마트투어리즘매니지먼트소프트웨어",
  "수학통계학과",
  "시스템생명공학",
  "식품생명공학전공",
  "양자원자력공학과",
  "영상디자인 융합전공",
  "영어영문학전공",
  "영화예술학과",
  "예술융합콘텐츠 융합전공",
  "우주항공공학전공",
  "우주항공시스템공학부",
  "음악과",
  "융합창업전공",
  "인공지능데이터사이언스학과",
  "인공지능학과",
  "인문사회계열",
  "일어일문학전공",
  "자연생명계열",
  "자유전공학부",
  "전자정보통신공학과",
  "정보보호학과",
  "지구자원시스템공학과",
  "지능IoT학과",
  "지능기전공학과",
  "지능정보융합학과",
  "지능형드론융합전공",
  "중국통상학전공",
  "창의소프트학부",
  "체육학과",
  "컴퓨터공학과",
  "패션디자인학과",
  "항공시스템공학과",
  "항공시스템공학전공",
  "항공우주공학전공",
  "행정학과",
  "한국언어문화전공",
  "호텔관광경영학전공",
  "호텔관광외식경영학부",
  "호텔외식관광프랜차이즈경영학과",
  "호텔외식비즈니스학과",
  "화학과",
  "환경에너지공간융합학과",
  "환경융합공학과",
  "회화과"
];

// 입력 필드 정의
const fields = [
  { label: '이메일', name: 'email', type: 'email' },
  { label: '비밀번호', name: 'password', type: 'password' },
  { label: '닉네임', name: 'name', type: 'text' },
  { label: '백준 아이디', name: 'baekjoonName', type: 'text' },
  { label: '학번', name: 'studentId', type: 'text' },
];

export default function Signup() {
  const [form, setForm] = useState({
    email: '',
    password: '',
    name: '',
    baekjoonName: '',
    studentId: '',
    department: '',
  });

  const navigate = useNavigate(); // 페이지 이동 함수
  
  // 입력값 변경 핸들러
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  
  // 회원가입 제출 요청
  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:4000/user/signup', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(form),
          credentials: 'include'  // 세션 쿠키 포함
      });

      const data = await response.json();

      if (response.status === 201) {
          alert(data.message || '회원가입이 성공적으로 완료되었습니다!');
          navigate('/login'); // 로그인 페이지로 이동
      } else {
          alert(`회원가입 실패: ${data.error || '알 수 없는 오류'}`);
      }
    } catch (error) {
      console.error('회원가입 중 오류 발생:', error);
      alert('네트워크 오류 또는 서버에 연결할 수 없습니다.');
    }
  };

  return (
    <div style={{ 
        fontFamily: 'Arial, sans-serif', 
        minHeight: '100vh', 
        margin: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: '80px',
        boxSizing: 'border-box'
    }}>
      {/* 상단 고정 헤더 */}
      <header style={{
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
      }}>
        회원가입
        <button
          onClick={() => navigate('/')}
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
      
      {/* 회원가입 폼 컨테이너 */}
      <div 
        style={{ 
          width: '90vw', 
          maxWidth: '500px',
          margin: '0 auto', 
          padding: '32px',
          boxSizing: 'border-box',
          border: '2px solid #00e5ff',
          borderRadius: '12px',
          backgroundColor: '#1a1e2a',
          boxShadow: '0 0 12px rgba(0, 229, 255, 0.25)',
          color: '#e0f7fa',
        }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#afefff' }}>회원가입</h2>
        
        {/* 기본 입력 필드 */}
        {fields.map(({ label, name, type }) => (
          <div key={name} style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#b3e5fc' }}>{label}</label>
            <input
              type={type}
              name={name}
              value={form[name]}
              onChange={handleChange}
              placeholder={name === 'studentId' ? '예: 23000000' : ''}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '6px',
                border: '1px solid #00e5ff55',
                backgroundColor: '#0d1117',
                color: '#e0f7fa',
                boxSizing: 'border-box',
              }}
            />
          </div>
        ))}
        
        {/* 학과(전공) 선택 드롭다운 */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#b3e5fc' }}>학과전공</label>
          <select
            name="department"
            value={form.department}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #00e5ff55',
              backgroundColor: '#0d1117',
              color: '#e0f7fa',
              boxSizing: 'border-box',
            }}
          >
            <option value="" style={{ backgroundColor: '#0d1117', color: '#e0f7fa' }}>- 선택 -</option>
            {departments.map((dept, idx) => (
              <option key={idx} value={dept} style={{ backgroundColor: '#0d1117', color: '#e0f7fa' }}>{dept}</option>
            ))}
          </select>
        </div>
        
        {/* 가입하기 버튼 */}
        <button
          onClick={handleSubmit}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#afefff',
            color: '#0d1117',
            border: 'none',
            borderRadius: '6px',
            fontWeight: 'bold',
            cursor: 'pointer',
            marginTop: '10px',
            boxShadow: '0 0 10px #00e5ff',
            transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
          }}
        >
          가입하기
        </button>
      </div>
    </div>
  );
}
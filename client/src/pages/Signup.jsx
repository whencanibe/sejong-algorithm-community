import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const departments = [
  "AI로봇학과",
  "AI연계융합전공",
  "소셜미디어매니지먼트소프트웨어",
  "스마트투어리즘매니지먼트소프트웨어",
  "시스템생명공학",
  "AI융합전자공학과",
  "IT계열",
  "건설환경공학과",
  "건축공학과",
  "건축학과",
  "경상호텔관광계열",
  "경영학부",
  "경제학과",
  "공과계열",
  "교육학과",
  "국방시스템공학과",
  "국어국문학과",
  "국제학부",
  "영어영문학전공",
  "일어일문학전공",
  "중국통상학전공",
  "글로벌미디어소프트웨어 융합전공",
  "글로벌인재학부",
  "국제통상전공",
  "국제협력전공",
  "한국언어문화전공",
  "글로벌조리학과",
  "금융보험애널리틱스 융합전공",
  "기계공학과",
  "기계공학전공",
  "항공우주공학전공",
  "나노신소재공학과",
  "뉴미디어퍼포먼스 융합전공",
  "대양휴머니티칼리지",
  "데이터사이언스학과",
  "럭셔리 브랜드 디자인 융합전공",
  "무용과",
  "문화산업경영 융합전공",
  "물리천문학과",
  "미디어커뮤니케이션학과",
  "반도체시스템공학과",
  "법학과",
  "법학부 법학전공",
  "비즈니스 애널리틱스 융합전공",
  "사이버국방학과",
  "생명시스템학부",
  "바이오산업자원공학전공",
  "바이오융합공학전공",
  "식품생명공학전공",
  "소프트웨어학과",
  "수학통계학과",
  "스마트생명산업융합학과",
  "양자원자력공학과",
  "엔터테인먼트 소프트웨어 융합전공",
  "역사학과",
  "영상디자인 융합전공",
  "영화예술학과",
  "예술융합콘텐츠 융합전공",
  "우주항공시스템공학부",
  "우주항공공학전공",
  "지능형드론융합전공",
  "항공시스템공학전공",
  "융합창업전공",
  "음악과",
  "인공지능데이터사이언스학과",
  "인공지능학과",
  "인문사회계열",
  "자연생명계열",
  "자유전공학부",
  "전자정보통신공학과",
  "정보보호학과",
  "지구자원시스템공학과",
  "지능IoT학과",
  "지능기전공학과",
  "무인이동체공학전공",
  "스마트기기공학전공",
  "지능정보융합학과",
  "창의소프트학부",
  "디자인이노베이션전공",
  "만화애니메이션텍전공",
  "체육학과",
  "컴퓨터공학과",
  "콘텐츠소프트웨어학과",
  "패션디자인학과",
  "항공시스템공학과",
  "행정학과",
  "호텔관광외식경영학부",
  "외식경영학전공",
  "호텔관광경영학전공",
  "호텔외식관광프랜차이즈경영학과",
  "호텔외식비즈니스학과",
  "화학과",
  "환경에너지공간융합학과",
  "환경융합공학과",
  "회화과"
];

const fields = [
  { label: '이메일', name: 'email' },
  { label: '비밀번호', name: 'password' },
  { label: '닉네임', name: 'name' },
  { label: '백준 아이디', name: 'baekjoonName' },
  { label: '학번', name: 'studentId' },
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

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
  try {
      // 백엔드 API 엔드포인트를 '/user/signup'으로 변경
      const response = await fetch('http://localhost:4000/user/signup', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(form),
          credentials: 'include' // 세션/쿠키를 통한 인증이 필요하므로 추가
      });

      const data = await response.json();

      if (response.status === 201) {
          alert(data.message || '회원가입이 성공적으로 완료되었습니다!');
          navigate('/');
      } else {
          alert(`회원가입 실패: ${data.error || '알 수 없는 오류'}`);
      }
  } catch (error) {
      console.error('회원가입 중 오류 발생:', error);
      alert('네트워크 오류 또는 서버에 연결할 수 없습니다.');
  }
};
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', minHeight: '100vh', backgroundColor: '#f3f4f6', margin: 0 }}>
      <header style={{
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
      }}>
        회원가입
      </header>

      <div style={{ width: '90vw', maxWidth: '700px', margin: '0 auto', padding: '0 20px' }}>
        {fields.map(({ label, name }) => (
          <div key={name} style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>{label}</label>
            <input
              type={name === 'password' ? 'password' : 'text'}
              name={name}
              value={form[name]}
              onChange={handleChange}
              placeholder={name === 'studentId' ? '예: 23000000' : ''}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '6px',
                border: '1px solid #ccc',
                boxSizing: 'border-box',
              }}
            />
          </div>
        ))}

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>학과전공</label>
          <select
            name="department"
            value={form.department}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #ccc',
              boxSizing: 'border-box',
            }}
          >
            <option value="">- 선택 -</option>
            {departments.map((dept, idx) => (
              <option key={idx} value={dept}>{dept}</option>
            ))}
          </select>
        </div>

        <button
          onClick={handleSubmit}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#2b2d42',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          가입하기
        </button>
      </div>
    </div>
  );
}
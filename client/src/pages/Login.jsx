import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    try {
      const res = await fetch('http://localhost:4000/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
        credentials: 'include',
      });

      const data = await res.json();
      console.log("서버 응답:", data);

      if (data.success) {
        const sessionCheck = await fetch('http://localhost:4000/user/me', {
          credentials: 'include'
        });

        if (sessionCheck.status === 200) {
          console.log("세션 확인 완료, 홈으로 이동");
          navigate('/home');
        } else {
          alert("세션 설정에 실패했습니다.");
        }
      } else {
        alert(data.message || '로그인에 실패했습니다.');
      }
    } catch (err) {
      alert('로그인 중 오류가 발생했습니다.');
      console.error(err);
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
        로그인
      </header>

      <div
        style={{
          width: '90vw',
          maxWidth: '700px',
          margin: '0 auto',
          padding: '0 20px',
          boxSizing: 'border-box',
        }}
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[{ label: '이메일', name: 'email' }, { label: '비밀번호', name: 'password' }].map(({ label, name }) => (
            <div key={name}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>{label}</label>
              <input
                type={name === 'password' ? 'password' : 'text'}
                name={name}
                value={form[name]}
                onChange={handleChange}
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

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#2b2d42',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: 'pointer',
              marginTop: '10px',
            }}
          >
            로그인
          </button>
        </form>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px', fontSize: '14px', color: '#666' }}>
          {/* <span style={{ cursor: 'pointer' }} onClick={() => navigate('/findPassword')}>비밀번호 찾기</span>
          <span>|</span>
          <span style={{ cursor: 'pointer' }} onClick={() => navigate('/findId')}>아이디 찾기</span>
          <span>|</span> */}
          <span style={{ cursor: 'pointer' }} onClick={() => navigate('/signup')}>회원가입</span>
        </div>
      </div>
    </div>
  );
}

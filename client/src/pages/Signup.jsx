import { useState } from 'react';

export default function Signup() {
  const [form, setForm] = useState({
    email: '',
    password: '',
    name: '',
    baekjoonName: '',
    studentId: '',
    department: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then((data) => console.log(data));
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
        <button
          onClick={() => (window.location.href = '/')}
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

      <div style={{  width: '90vw', maxWidth: '700px', margin: '0 auto', padding: '0 20px' }}>
        {['email', 'password', 'name', 'baekjoonName', 'studentId', 'department'].map((field) => (
          <div key={field} style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>{field}</label>
            <input
              type={field === 'password' ? 'password' : 'text'}
              name={field}
              value={form[field]}
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

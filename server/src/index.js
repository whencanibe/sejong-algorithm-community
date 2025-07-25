import dotenv from 'dotenv';
import app from './app.js';

dotenv.config();
const PORT = process.env.PORT;

app.listen(PORT, async () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
  // 개발 중에는 핫 리로드 될때마다 전체 유저 동기화 시키므로 주석 처리.
  try {
    //await syncAllUsers();
  } catch (err) {
    console.error('서버 시작 후 초기 동기화 실패:', err.message);
  }
});

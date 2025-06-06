import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import postRouter from './routes/postRouter.js';
import userRouter from './routes/userRouter.js';
import solvedacRouter from './routes/solvedacRouter.js';
import userInfoRouter from './routes/userInfoRouter.js';
import { startSyncSolvedList, syncAllUsers } from './jobs/syncSolvedListJob.js';
import { startWeeklySnapshot } from './jobs/weeklySnapshotJob.js';
import errorHandler from './middlewares/errorHandler.js';
import session from 'express-session';
import commentRouter from './routes/commentRouter.js';
import dayquestRouter from './routes/dayquestRouter.js';
import { getProblemDetail } from './services/solvedacService.js';
import { getDeptTotalsThisWeek, getDeptUserRanking } from './repositories/weeklyRankRepository.js';
import cardRouter from './routes/cardRouter.js';
import path from 'path';

dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET, 
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, 
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 2// 2시간
  }
}));

app.use('/solvedac', solvedacRouter);
app.use('/posts', postRouter);
app.use('/info', userInfoRouter);
app.use('/comments', commentRouter);
app.use('/user', userRouter);
app.use('/dayquest', dayquestRouter);
app.use('/card', cardRouter);
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use(errorHandler); // 최종 에러 처리기이므로 모든 라우터 뒤에 위치하여야 함.
app.listen(PORT, async () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
  // 개발 중에 서버 켜질때마다 전체 유저 동기화 시켜서 우선 주석 처리.
  // try {
  //   await syncAllUsers();
  // } catch (err) {
  //   console.error('서버 시작 후 초기 동기화 실패:', err.message);
  // }
});

startSyncSolvedList();
startWeeklySnapshot();
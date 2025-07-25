import express from 'express';
import cors from 'cors';
import postRouter from './routes/postRouter.js';
import userRouter from './routes/userRouter.js';
import solvedacRouter from './routes/solvedacRouter.js';
import userInfoRouter from './routes/userInfoRouter.js';
import { syncAllUsers } from './jobs/syncSolvedListJob.js';
import errorHandler from './middlewares/errorHandler.js';
import session from 'express-session';
import commentRouter from './routes/commentRouter.js';
import dayquestRouter from './routes/dayquestRouter.js';
import { getProblemDetail } from './services/solvedacService.js';
import cardRouter from './routes/cardRouter.js';
import path from 'path';

const app = express();

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

export default app;
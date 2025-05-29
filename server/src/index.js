import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import postRouter from './routes/postRouter.js';
import userRouter from './routes/userRouter.js';
import solvedacRouter from './routes/solvedacRouter.js';
import userInfoRouter from './routes/userInfoRouter.js';
import { startSyncSolvedList } from './jobs/syncSolvedListJob.js';
import { startWeeklySnapshot } from './jobs/weeklySnapshotJob.js';
import errorHandler from './middlewares/errorHandler.js';
import session from 'express-session';
import commentRouter from './routes/commentRouter.js';
import dayquestRouter from './routes/dayquestRouter.js';
import { getProblemDetail } from './services/solvedacService.js';
import { getDeptTotalsThisWeek, getDeptUserRanking } from './repositories/weeklyRankRepository.js';
import cardRouter from './routes/cardRouter.js';

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

app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

startSyncSolvedList();
startWeeklySnapshot();
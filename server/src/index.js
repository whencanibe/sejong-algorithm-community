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

dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

app.use('/user', userRouter);
app.use('/solvedac', solvedacRouter);
app.use('/posts', postRouter);
app.use('/info', userInfoRouter);

app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

startSyncSolvedList();
startWeeklySnapshot();
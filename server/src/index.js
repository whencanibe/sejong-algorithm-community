import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import postRouter from './routes/postRouter.js';

import userRouter from './routes/userRouter.js';
import solvedacRouter from './routes/solvedacRouter.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

app.use('/user', userRouter);
app.use('/solvedac', solvedacRouter);
app.use('/posts', postRouter);

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
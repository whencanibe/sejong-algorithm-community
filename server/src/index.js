import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import postRouter from './routes/postRouter.js';
import userRouter from './routes/userRouter.js';
import solvedacRouter from './routes/solvedacRouter.js';
import session from 'express-session';

dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

app.use('/solvedac', solvedacRouter);
app.use('/posts', postRouter);

app.use(session({
  secret: process.env.SESSION_SECRET, 
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, 
    httpOnly: true,
    maxAge: 1000 * 60 * 60 // 1시간
  }
}));
app.use('/user', userRouter);

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
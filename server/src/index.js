import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import userRouter from './routes/userRouter.js';
import solvedacRouter from './routes/solvedacRouter.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

app.use('/user', userRouter);
app.use('/solvedac', solvedacRouter);

app.listen(PORT, () => {
  console.log(`API server listening on http://localhost:${PORT}`);
});

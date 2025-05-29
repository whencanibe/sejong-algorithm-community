
// src/middlewares/upload.js
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// 업로드 디렉토리 없으면 생성
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // uploads 폴더
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, file.fieldname + '-' + uniqueName);
  },
});

export const upload = multer({ storage });
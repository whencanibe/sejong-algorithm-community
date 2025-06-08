import multer from 'multer';
import path from 'path';
import fs from 'fs';

// 업로드 디렉토리 생성 없으면 자동 생성
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
/**
 * multer 저장 방식 설정 (diskStorage):
 * - 파일은 로컬 디스크에 저장됨
 * - 저장 위치와 파일명 규칙을 정의함
 */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // uploads/' 디렉토리에 저장
  },
    // 저장될 파일 이름 지정 (예: image-1717849234781-123456789.png)
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, file.fieldname + '-' + uniqueName);
  },
});
// 설정된 저장 방식으로 multer 인스턴스 생성하여 export
export const upload = multer({ storage });
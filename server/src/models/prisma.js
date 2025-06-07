import pkg from '@prisma/client';
const {PrismaClient} = pkg;

// 이미 생성된 PrismaClient가 있다면 재사용 (핫 리로드 대비)
const prisma =
  global.prisma || // 이미 만들어 뒀으면 재사용
  new PrismaClient({
    log: ['error', 'warn'],   // 로그 수준 설정 (오류 및 경고만 출력)
  });

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;              // dev에서 핫리로드 중복 방지
}

export default prisma;

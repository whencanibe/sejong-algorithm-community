import pkg from '@prisma/client';
const {PrismaClient} = pkg;

const prisma =
  global.prisma || // 이미 만들어 뒀으면 재사용
  new PrismaClient({
    log: ['query', 'error', 'warn'],   // 옵션 예시
  });

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;              // dev에서 핫리로드 중복 방지
}

export default prisma;

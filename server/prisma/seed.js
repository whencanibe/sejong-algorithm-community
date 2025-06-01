// prisma/seed.js
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const majors = ['컴퓨터공학과', '소프트웨어학과', '정보보호학과'];
    const year = () => String(19 + Math.floor(Math.random() * 5)); // 19~23
    const names = ['오냐', '치팅', '했서', '소혀']
    const baekjoonNames = ['muzavicoder', '04select', 'choipr', 'shl3088']
    // 4명 계정 임의 생성
    for (let i = 0; i < 4; i++) {
        const email = `testuser${i}@example.com`;
        await prisma.user.upsert({
            where: { email },
            update: {},
            create: {
                email,
                password: await bcrypt.hash('test1234', 10),
                name: names[i],
                baekjoonName: baekjoonNames[i],
                department: majors[i % majors.length],
                studentId: year() + String(100000 + i),   // 예) 23100000
                tier: '브론즈 V',
                solvedNum: 0,
                rank: null,
                 profileImage: "https://api.dicebear.com/7.x/bottts/svg?seed=default",
            }
        });
    }

    console.log('테스트용 user 삽입 완료!');

    const cards = [
        {
          title: "문제해결 카드",
          comment: "스스로 해답을 찾아낸 똑똑한 우주인!",
          image: "/카드/문제해결.png",
        },
        {
            title: "꾸준 카드",
            comment: "쉽지 않았지만 끝까지 해냈어요!",
            image: "/카드/꾸준.png",
          },
          {
            title: "끈기 카드",
            comment: "오래 걸려도 끝까지 도전!",
            image: "/카드/끈기.png",
          },
          {
            title: "도전 카드",
            comment: "처음 푸는 유형도 멋지게 도전했어요!",
            image: "/카드/도전.png",
          },
          {
            title: "성실 카드",
            comment: "언제나 꾸준하게 임무 수행!",
            image: "/카드/성실.png",
          },
          {
            title: "인내 카드",
            comment: "끝까지 포기하지 않는 우주인!",
            image: "/카드/인내.png",
          },
          {
            title: "정직 카드",
            comment: "올바르게, 스스로 풀었어요 !",
            image: "/카드/정직.png",
          },
      ];
    
      for (const card of cards) {
        await prisma.card.upsert({
          where: { title: card.title },
          update: {},
          create: card,
        });
      }
    }

main()
    .catch(e => { console.error(e); process.exit(1); })
    .finally(() => prisma.$disconnect());

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
                rank: null
            }
        });
    }

    console.log('테스트용 user 삽입 완료!');
}

main()
    .catch(e => { console.error(e); process.exit(1); })
    .finally(() => prisma.$disconnect());

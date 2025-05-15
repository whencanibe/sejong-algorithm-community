import prisma from "../models/prisma.js";

export async function createUser({ email, hashedPassword, name, baekjoonName }) {
    return prisma.user.create({
        data: { email, password: hashedPassword, name, baekjoonName }, // db에 저장할 값
        select: { id: true, email: true, name: true } // 응답에 반환될 값 선택
    })
}

export async function findUserById(id) {
    return await prisma.user.findUnique({
        where: { id }
    })
}

export async function findUserByEmail(email) {
    return await prisma.user.findUnique({
        where: { email }
    })
}

export async function getRankByUserId(id) {
  const me = await prisma.user.findUnique({
    where: { id },
    select: { ranking: true }
  });

  if (!me) throw new Error("해당 유저 없음");

  const count = await prisma.user.count({
    where: {
      rank: { lt: me.rank }  // 나보다 순위 높은 사람 수
    }
  });

  return count + 1; 
}

export async function getRankInMajorByUserId(id) {
  const me = await prisma.user.findUnique({
    where: { id },
    select: { ranking: true }
  });

  if (!me) throw new Error("해당 유저 없음");

  const count = await prisma.user.count({
    where: {
      rank: { lt: me.rank },
      major: me.major
    }
  });

  return count + 1; 
}




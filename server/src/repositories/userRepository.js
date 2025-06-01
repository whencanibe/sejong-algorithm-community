import { AppError } from "../errors/AppError.js";
import prisma from "../models/prisma.js";
import { Prisma } from '@prisma/client';

export async function createUser({ email, hashedPassword, name, baekjoonName, department, studentId }, tx = prisma) {
  return tx.user.create({
    data: { email, password: hashedPassword, name, baekjoonName, department, studentId }, // db에 저장할 값
    select: { id: true, email: true, name: true, department: true, studentId: true } // 응답에 반환될 값 선택
  })
}

export async function findUserById(id, tx = prisma) {
  if (id == null) throw new AppError('userId가 없습니다', 400);
  return await tx.user.findUnique({
    where: { id }
  })
}

export const findUserByEmail = async (email, tx = prisma) => {
  return await tx.user.findUnique({
    where: { email }
  });
}

//unique key or prime key 가 아니라면 findUnique 사용 x => findFirst
export const findUserByName = async (name, tx = prisma) => {
  return await tx.user.findFirst({
    where: { name }
  });
}

export const findUserByBaekjoonName = async (baekjoonName, tx = prisma) => {
  return await tx.user.findFirst({
    where: { baekjoonName }
  });
}

export const findUserByStudentId = async (studentId, tx = prisma) => {
  return await tx.user.findFirst({
    where: { studentId }
  });
}

/**
 * @param {number} id
 * @param {Object}   data  - 수정할 키/값 쌍 { name, password, major, … }
 * @returns {Promise<Object|null>}  수정 후 일부 필드
 */
export async function updateUser(id, data) {
  return prisma.user.update({
    where: { id },
    data,
    select: {                     // 수정 후 응답으로 내보낼 필드
      id: true,
      email: true,
      name: true,
      baekjoonName: true,
      department: true,
      tier: true,
      solvedNum: true,
    }
  });
}

/**
 *  전체 사용자 목록 가져오기
 *  filter    : 선택적 where 조건(전공별 검색 등)
 *  반환값     : 사용자 배열
 */
export async function findAllUsers(filter = {}) {
  return prisma.user.findMany({
    where: filter,                // 예) { major: "컴퓨터공학" }
    select: {
      id: true,
      name: true,
      baekjoonName: true,
      department: true,
      rank: true,
      tier: true,
      solvedNum: true
    },
    orderBy: { rank: 'asc' }      // 랭킹 순으로 정렬
  });
}

export async function getRankByUserId(id) {
  const me = await prisma.user.findUnique({
    where: { id },
    select: { rank: true }
  });

  if (!me) throw new Error("해당 유저 없음");

  const count = await prisma.user.count({
    where: {
      rank: { lt: me.rank }  // 나보다 순위 높은 사람 수
    }
  });

  return count + 1;
}

export async function getRankInDepartmentByUserId(id) {
  const me = await prisma.user.findUnique({
    where: { id },
    select: { rank: true, department: true }
  });

  if (!me) throw new AppError("해당 유저 없음", 404);

  const count = await prisma.user.count({
    where: {
      rank: { lt: me.rank },
      department: me.department
    }
  });

  return count + 1;
}

export async function getPercentile(userId) {
  const [rank, total] = await Promise.all([
    getRankByUserId(userId),
    prisma.user.count()
  ]);

  if (!rank) return null;          // rank가 아직 계산되지 않은 경우

  return Math.round((rank / total) * 100);
}

export async function getPercentileInDepartement(userId) {
  // 사용자 전공 알아오기
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { department: true }
  });
  if (!user) throw new AppError('유저 없음', 404);

  const [rank, total] = await Promise.all([
    getRankInDepartmentByUserId(userId),
    prisma.user.count({
      where: {
        department: user.department
      }
    })
  ]);

  if (!rank) return null;          // rank가 아직 계산되지 않은 경우

  return Math.round((rank / total) * 100);
}

export async function getNumberOfUsers() {
  return await prisma.user.count();
}

export async function updateUserProfileImage(userId, imageUrl) {
  return await prisma.user.update({
    where: { id: userId },
    data: { profileImage: imageUrl },
  });
}

export async function deleteUserById(userId) {
  return await prisma.user.delete({
    where: { id: userId },
  });
}

/**
 * 학생 전체 문제 푼 개수 순위
 * @param {Number} limit - 몇등까지 보여줄 지
 * @returns {Array}
 */
export async function getGlobalRanking(limit) {
  return await prisma.$queryRaw`
    SELECT
      id,
      name,
      department,
      solvedNum,
      RANK() OVER (ORDER BY solvedNum DESC) AS rank
    FROM User
    ORDER BY solvedNum DESC
    ${limit ? Prisma.raw(`LIMIT ${Number(limit)}`) : Prisma.raw(``)}
  `;
}

/**
 * 학과별 랭킹
 * @param {String} department - 사용자 학과
 * @param {Number} limit - 몇등까지 보여줄 지
 * @returns {Array}
 */
export async function getDepartmentRanking(department, limit) {
  return await prisma.$queryRaw`
    SELECT
      id,
      name,
      solvedNum,
      RANK() OVER (PARTITION BY department ORDER BY solvedNum DESC) AS rank
    FROM User
    WHERE department = ${department}
    ORDER BY solvedNum DESC
    ${limit ? Prisma.raw(`LIMIT ${Number(limit)}`) : Prisma.raw(``)}
  `;
}
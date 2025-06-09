import bcrypt from 'bcryptjs';
import prisma from "../models/prisma.js";
import { createUser, deleteUserById, findUserByBaekjoonName, findUserByEmail, findUserById, findUserByName, findUserByStudentId } from '../repositories/userRepository.js';

import { syncSingleUser } from '../jobs/syncSolvedListJob.js';
import { AppError } from '../errors/AppError.js';

/**
 * 회원가입 서비스 로직
 *
 * - 트랜잭션 내에서 중복 이메일, 닉네임, 백준 아이디, 학번을 검사
 * - 비밀번호를 해시하여 DB에 사용자 정보를 저장
 * - 저장 후 백준 solved.ac 정보 동기화 수행
 * - 만약 동기화 실패 시, 가입된 사용자 정보를 롤백(삭제)
 *
 * @param {Object} userInfo - 회원가입 입력 데이터
 * @returns {Object} 생성된 사용자 객체
 * @throws {AppError} 중복 값 존재 또는 동기화 실패 시 예외 발생
 */
export async function signupService({ email, password, name, baekjoonName, department, studentId }) {
  let user = null;
  try {
    user = await prisma.$transaction(async (tx) => {
      const existsEmail = await findUserByEmail(email, tx);
      console.log(existsEmail);
      if (existsEmail) throw new AppError('중복 이메일입니다', 409);

      const existsName = await findUserByName(name, tx);
      if (existsName) throw new AppError('중복된 닉네임입니다.', 409);

      const existsBaekjoonName = await findUserByBaekjoonName(baekjoonName, tx);
      if (existsBaekjoonName) throw new AppError('중복된 백준 아이디입니다.', 409);

      const existsStudentId = await findUserByStudentId(studentId, tx);
      if (existsStudentId) throw new AppError('중복된 학번입니다.', 409);

      const hashedPassword = await bcrypt.hash(password, 10); //비밀번호 해싱 후 저장

      return await createUser({
        email: email, hashedPassword: hashedPassword, name: name, baekjoonName: baekjoonName, department, studentId
      }, tx);
    });

    //await syncSingleUser(user.id);

    return user;
  } catch (error) {
    if (user) {
      await deleteUserById(user.id); // Rollback - syncSingUser 실패시 회원가입 된 회원 다시 삭제
    }
    throw error;
  }

}

/**
 * 로그인 서비스 로직
 *
 * - 이메일 기반 사용자 조회
 * - 평문 비밀번호와 저장된 해시 비교
 * - 일치 시 사용자 객체 반환
 *
 * @param {string} email - 로그인 입력 이메일
 * @param {string} plainPassword - 로그인 입력 비밀번호
 * @returns {Object} 인증된 사용자 객체
 * @throws {AppError} 사용자 존재 여부 또는 비밀번호 불일치 시 예외 발생
 */
export const loginService = async (email, plainPassword) => {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new AppError("존재하지 않는 이메일입니다.", 404);
  }

  const isMatch = await bcrypt.compare(plainPassword, user.password);
  if (!isMatch) {
    throw new AppError("비밀번호가 일치하지 않습니다.", 401);
  }

  return user;
};

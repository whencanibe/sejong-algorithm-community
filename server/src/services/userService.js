import bcrypt from 'bcryptjs';
import prisma from "../models/prisma.js";
import { createUser, deleteUserById, findUserByBaekjoonName, findUserByEmail, findUserById, findUserByName, findUserByStudentId } from '../repositories/userRepository.js';

import { syncSingleUser } from '../jobs/syncSolvedListJob.js';
import { ensureSnapshotForUser } from './snapshotService.js';
import { AppError } from '../errors/AppError.js';

export async function signupService({ email, password, name, baekjoonName, department, studentId }) {
  let user = null;
  try {
    user = await prisma.$transaction(async (tx) => {
      const existsEmail = await findUserByEmail(email, tx);
      if (existsEmail) throw new AppError('중복 이메일입니다', 409);

      const existsName = await findUserByName(name, tx);
      if (existsName) throw new AppError('중복된 닉네임입니다.', 409);

      const existsBaekjoonName = await findUserByBaekjoonName(baekjoonName, tx);
      if (existsBaekjoonName) throw new AppError('중복된 백준 아이디입니다.', 409);

      const existsStudentId = await findUserByStudentId(studentId, tx);
      if (existsStudentId) throw new AppError('중복된 학번입니다.', 409);

      const hashedPassword = await bcrypt.hash(password, 10);

      return await createUser({
        email: email, hashedPassword: hashedPassword, name: name, baekjoonName: baekjoonName, department, studentId
      }, tx);
    });

    await syncSingleUser(user.id);

    return user;
  } catch (error) {
    if (user) {
      await deleteUserById(user.id); // Rollback - syncSingUser 실패시 회원가입 된 회원 다시 삭제
    }
    throw error;
  }

}

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

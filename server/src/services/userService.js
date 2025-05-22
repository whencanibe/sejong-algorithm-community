import bcrypt from 'bcryptjs'
import { createUser, findUserByEmail, findUserById } from '../repositories/userRepository.js';
import { syncSingleUser } from '../jobs/syncSolvedListJob.js';
import { ensureSnapshotForUser } from './snapshotService.js';

//userData : { email, password, name, baekjoonName, department, studentId }
export async function signupService(userData) {
  const exists = await findUserByEmail(userData.email);
  if (exists) throw new Error('중복이메일');

  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const newUserData = {
    ...userData,
    password: hashedPassword,
  };
  const user = await createUser(newUserData);

  await syncSingleUser(user.id);
  const updatedUser = await findUserById(user.id);
  await ensureSnapshotForUser(updatedUser); //이번주 기준 푼 문제 계산 위해 현재 문제 개수 db에 저장
  return user;
}

export const loginService = async (email, plainPassword) => {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error("존재하지 않는 이메일입니다.");
  }

  const isMatch = await bcrypt.compare(plainPassword, user.password);
  if (!isMatch) {
    throw new Error("비밀번호가 일치하지 않습니다.");
  }

  return user;
};


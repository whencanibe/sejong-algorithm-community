import bcrypt from 'bcryptjs'
import { createUser, findUserByEmail, findUserById } from '../repositories/userRepository.js';

import { syncSingleUser } from '../jobs/syncSolvedListJob.js';
import { ensureSnapshotForUser } from './snapshotService.js';

export async function signupService({ email, password, name, baekjoonName, department, studentId }) {
  const exists = await findUserByEmail(email);
  if (exists) throw new Error('중복이메일');

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await createUser({
    email: email, hashedPassword: hashedPassword, name: name, baekjoonName: baekjoonName, department, studentId
  });

  await syncSingleUser(user.id);
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

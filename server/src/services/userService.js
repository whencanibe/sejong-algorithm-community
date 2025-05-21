import bcrypt from 'bcryptjs'
import { createUser, findUserByEmail, findUserById } from '../repositories/userRepository.js';

import { syncSingleUser } from '../jobs/syncSolvedListJob.js';
import { ensureSnapshotForUser } from './snapshotService.js';

export async function signup({ email, password, name, baekjoonName, department, studentId }) {
    const exists = await findUserByEmail(email);
    if (exists) throw new Error('중복이메일');

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await createUser({
         email: email, hashedPassword: hashedPassword, name: name, baekjoonName: baekjoonName , department, studentId
        });
    
    await syncSingleUser(user.id);
    const updatedUser = await findUserById(user.id);
    await ensureSnapshotForUser(updatedUser); //이번주 기준 푼 문제 계산 위해 현재 문제 개수 db에 저장
    return user;
}
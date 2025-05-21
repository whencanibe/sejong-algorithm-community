import bcrypt from 'bcryptjs'
import { createUser, findUserByEmail } from '../repositories/userRepository.js';

import { syncSingleUser } from '../jobs/syncSolvedListJob.js';

export async function signup({ email, password, name, baekjoonName, department, studentId }) {
    const exists = await findUserByEmail(email);
    if (exists) throw new Error('중복이메일');

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await createUser({
         email: email, hashedPassword: hashedPassword, name: name, baekjoonName: baekjoonName , department, studentId
        });
    
    await syncSingleUser(user.id);
    return user;
}
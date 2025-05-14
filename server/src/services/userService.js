import bcrypt from 'bcryptjs'
import { createUser, findUserByEmail } from '../repositories/userRepository.js';

export async function signup({ email, password, name, baekjoonName }) {
    const exists = await findUserByEmail(email);
    if (exists) throw new Error('중복이메일');

    const hashedPassword = await bcrypt.hash(password, 10);

    return createUser({ email: email, hashedPassword: hashedPassword, name: name, baekjoonName: baekjoonName });
}

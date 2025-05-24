import bcrypt from 'bcryptjs'
import { createUser } from '../repositories/userRepository.js';
import { findUserByEmail } from '../repositories/userRepository.js';

export const signupService = async (userData) => {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
  
    const newUserData = {
      ...userData,
      password: hashedPassword,
    };
  
    const createdUser = await createUser(newUserData);
  
    return createdUser;
  };

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

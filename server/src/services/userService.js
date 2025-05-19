import bcrypt from 'bcryptjs'
import { createUser } from '../repositories/userRepository.js';

export const signupService = async (userData) => {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
  
    const newUserData = {
      ...userData,
      password: hashedPassword,
    };
  
    const createdUser = await createUser(newUserData);
  
    return createdUser;
  };

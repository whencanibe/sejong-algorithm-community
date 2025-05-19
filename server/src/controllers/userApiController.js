import { signupService } from "../services/userService.js";
import { loginService } from '../services/userService.js';

export const signup = async (req, res) => {
  try {
    const userData = req.body;

    const newUser = await signupService(userData); 

    res.status(201).json({
      message: "회원가입 성공",
      user: {
        id: newUser.id,
        email: newUser.email,
      }
    });
  } catch (err) {
    console.error("회원가입 오류:", err);
    res.status(500).json({
      message: "회원가입 실패",
      error: err.message,
    });
  }
};


export const login = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await loginService(email, password);
  
      req.session.user = {
        id: user.id,
        email: user.email,
      };
  
      res.status(200).json({
        message: '로그인 성공',
        user: req.session.user,
      });
    } catch (err) {
      console.error("로그인 오류:", err);
      res.status(401).json({
        message: '로그인 실패',
        error: err.message,
      });
    }
  };
import { signupService } from "../services/userService.js";

export const signup = async (req, res) => {
  try {
    const userData = req.body;

    const newUser = await signupService(userData); 

    res.status(201).json({
      message: "회원가입 성공",
      user: {
        id: newUser.id,
        email: newUser.email,
        nickname: newUser.nickname,
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
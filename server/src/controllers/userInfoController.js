import { getPercentilesForUser, getUserInfo } from "../services/userInfoService.js"; 
import * as userRepo from '../repositories/userRepository.js';

export async function getUserInfoCtrl(req, res, next) {
    try {
        const userId = Number(req.params.id);
        const userInfo = await getUserInfo(userId);
        res.status(201).json(userInfo);
    } catch (error) {
        res.status(404).json({ error: error.message || '사용자 정보 조회 실패' });
    }
}

export async function getPercentilesForUserCtrl(req, res, next) {
    try {
        const userId = Number(req.params.id);
        const percentiles = await getPercentilesForUser(userId);
        res.status(201).json(percentiles);
    } catch (error) {
        res.status(404).json({ error: error.message || '상위 퍼센트 조회 실패' });
    }
}

export async function getUserInfoSessionCtrl(req, res, next) {
    try {
        const userId = Number(req.session?.user?.id);
        const userInfo = await getUserInfo(userId);
        res.status(201).json(userInfo);
    } catch (error) {
        res.status(404).json({ error: error.message || '사용자 정보 조회 실패' });
    }
}

export async function getPercentilesForUserSessionCtrl(req, res, next) {
    try {
        const userId = Number(req.session?.user?.id);
        const percentiles = await getPercentilesForUser(userId);
        res.status(201).json(percentiles);
    } catch (error) {
        res.status(404).json({ error: error.message || '상위 퍼센트 조회 실패' });
    }
}

  export async function uploadProfileImage(req, res) {
    try {
      const userId = req.session.user.id;
      const filename = req.file.filename;
      const imageUrl = `/uploads/${filename}`; // static 경로
  
      await userRepo.updateUserProfileImage(userId, imageUrl);
  
      return res.status(200).json({ url: imageUrl }); // 클라이언트가 사용하기 쉽게 반환
    } catch (err) {
      console.error("uploadProfileImage 에러:", err.message);
      res.status(500).json({ error: "이미지 업로드 실패" });
    }
  }

  export async function basicProfile(req, res) {
    try {
      const userId = req.session.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "로그인이 필요합니다." });
      }
  
      const user = await userRepo.findUserById(userId);
      if (!user) {
        return res.status(404).json({ message: "사용자 없음" });
      }
  
      res.json({
        name: user.name,
        department: user.department,
        profileImage: user.profileImage
      });
    } catch (err) {
      console.error("basicProfile 에러:", err.message);
      res.status(500).json({ message: "서버 오류" });
    }
  }
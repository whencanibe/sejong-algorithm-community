import { getPercentilesForUser, getUserInfo, updateUserProfileImage } from "../services/userInfoService.js";
import * as userRepo from '../repositories/userRepository.js';
import { AppError } from "../errors/AppError.js";
import { normalizeBigInt } from "../utils/nomalizeBigint.js";
import * as service from '../services/userInfoService.js';
import { updateNickname } from '../services/userInfoService.js'; // ✅ 꼭 필요
import { syncSingleUser } from "../jobs/syncSolvedListJob.js";


export async function getUserInfoSessionCtrl(req, res, next) {
  try {
    const userId = Number(req.session?.user?.id);
    const userInfo = await getUserInfo(userId);
    res.status(200).json(userInfo);
  } catch (error) {
    next(error);
  }
}

export async function getPercentilesForUserSessionCtrl(req, res, next) {
  try {
    const userId = Number(req.session?.user?.id);
    const percentiles = await getPercentilesForUser(userId);
    res.status(200).json(percentiles);
  } catch (error) {
    next(error);
  }
}

export async function uploadProfileImage(req, res) {
  try {
    const userId = req.session.user.id;
    const filename = req.file.filename;
    const imageUrl = `/uploads/${filename}`; // static 경로

    //Service 레이어에 있는 함수 (repository 레이어 함수 이름과 동일해서 혼용 주의)
    await updateUserProfileImage(userId, imageUrl);

    return res.status(200).json({ url: imageUrl }); // 클라이언트가 사용하기 쉽게 반환
  } catch (err) {
    console.error("uploadProfileImage 에러:", err.message);
    next(err);
  }
}

export async function basicProfile(req, res) {
  const userId = req.session.user?.id;
  if (!userId) {
    return next(new AppError('로그인이 필요합니다.', 401));
  }

  try {
    const user = await userRepo.findUserById(userId);
    if (!user) {
      return next(new AppError('사용자를 찾을 수 없습니다.', 404));
    }

    res.json({
      name: user.name,
      department: user.department,
      profileImage: user.profileImage
    });
  } catch (err) {
    console.error("basicProfile 에러:", err.message);
    next(err);
  }
}

export async function getGlobalRankingCtrl(req, res, next) {
  try {
    //const limit = req.query.limit ? Number(req.query.limit) : 10;
    const limit = 20;
    const data = await userRepo.getGlobalRanking(limit);
    res.status(201).json(normalizeBigInt(data));
  } catch (e) {
    next(e);
  }
}

export async function getDepartmentRankingCtrl(req, res, next) {
  try {
    const department = req.params.department;
    //const limit = req.query.limit ? Number(req.query.limit) : undefined;
    const limit = 20;
    const data = await userRepo.getDepartmentRanking(department, limit);
    res.status(201).json(normalizeBigInt(data));
  } catch (e) {
    next(e);
  }
}

// export async function changeNickname(req, res, next) {
//   try {
//     const userId = req.session?.user?.id;
//     const { newName } = req.body;

//     if (!userId) return res.status(401).json({ error: '로그인이 필요합니다.' });
//     if (!newName) return res.status(400).json({ error: '닉네임을 입력하세요.' });

//     const updatedUser = await service.updateNickname(userId, newName);

//     // 세션 정보도 업데이트 해줄 수 있음
//    // req.session.user.name = newName;

//     res.json({ message: '닉네임이 성공적으로 변경되었습니다.', user: updatedUser });
//   } catch (error) {
//     next(error);
//   }
// }

export async function changeNickname(req, res, next) {
  try {
    const userId = req.session.user?.id;
    const { name: newName } = req.body;

    console.log("📥 클라이언트 닉네임 요청:", { userId, newName }); // 여기 로그도 추가

    if (!userId || !newName) {
      throw new AppError("닉네임 변경 요청이 잘못되었습니다.", 400);
    }

    const updated = await updateNickname(userId, newName);
    res.json({ success: true, updated });
  } catch (err) {
    next(err);
  }
}

export async function refreshSolvedInfoSessionCtrl(req, res, next) {
    try {
        const userId = Number(req.session?.user?.id);
        await syncSingleUser(userId);             // Solved.ac <-> DB 
        res.status(200).json({ ok: true });
    } catch (error) {
        next(error);
    }
}
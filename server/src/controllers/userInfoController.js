import { getPercentilesForUser, getUserInfo, updateUserProfileImage } from '../services/userInfoService.js';
import * as userRepo from '../repositories/userRepository.js';
import { AppError } from '../errors/AppError.js';
import { normalizeBigInt } from '../utils/nomalizeBigint.js';
import * as service from '../services/userInfoService.js';
import { updateNickname } from '../services/userInfoService.js'; // ✅ 꼭 필요
import { syncSingleUser } from '../jobs/syncSolvedListJob.js';

/**
 * [GET] /api/mypage
 * - 세션 기반으로 로그인한 사용자의 상세 정보를 반환
 */
export async function getUserInfoSessionCtrl(req, res, next) {
  try {
    const userId = Number(req.session?.user?.id);
    const userInfo = await getUserInfo(userId); // 사용자 전체 정보 가져오기 (티어, solved 개수 포함)
    res.status(200).json(userInfo);
  } catch (error) {
    next(error);
  }
}
/**
 * [GET] /api/percentile
 * - 로그인한 사용자의 전체 백분위 및 전공별 백분위를 계산하여 반환
 * - 내부적으로 `getPercentilesForUser(userId)` 호출
 */
export async function getPercentilesForUserSessionCtrl(req, res, next) {
  try {
    const userId = Number(req.session?.user?.id);
    const percentiles = await getPercentilesForUser(userId);  // 전체 및 학과 내 백분위 계산
    res.status(200).json(percentiles);
  } catch (error) {
    next(error);
  }
}

/**
 * [POST] /api/upload-profile
 * - 프로필 이미지 업로드 및 저장 경로를 DB에 저장
 * - Multer로 받은 파일명을 static 경로로 가공하여 DB에 저장
 * - 내부적으로 `updateUserProfileImage(userId, imageUrl)` 호출
 */
export async function uploadProfileImage(req, res) {
  try {
    const userId = req.session.user.id;
    const filename = req.file.filename;
    const imageUrl = `/uploads/${filename}`; // static 경로

    await updateUserProfileImage(userId, imageUrl); // 사용자 프로필 이미지 URL 갱신

    return res.status(200).json({ url: imageUrl }); // 새 이미지 경로 반환
  } catch (err) {
    console.error('uploadProfileImage 에러:', err.message);
    next(err);
  }
}

/**
 * [GET] /api/basicprofile
 * - 로그인한 사용자의 기본 정보(name, department, profileImage)만 간략히 반환
 * - DB 접근은 `userRepo.findUserById(userId)`를 통해 수행
 */
export async function basicProfile(req, res) {
  const userId = req.session.user?.id;
  if (!userId) {
    return next(new AppError('로그인이 필요합니다.', 401));
  }

  try {
    const user = await userRepo.findUserById(userId);   // 사용자의 이름,학과,프로필 조회 
    if (!user) {
      return next(new AppError('사용자를 찾을 수 없습니다.', 404));
    }

    res.json({
      name: user.name,
      department: user.department,
      profileImage: user.profileImage
    });
  } catch (err) {
    console.error('basicProfile 에러:', err.message);
    next(err);
  }
}

/**
 * [GET] /api/globalranking
 * - 전 사용자 중 문제 해결 수 기준 랭킹을 반환
 * - Raw SQL 기반 userRepo.getGlobalRanking(limit) 호출
 * - bigint 필드를 JSON에서 안전하게 사용하기 위해 normalizeBigInt 적용
 */
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

/**
 * [GET] /api/studentranking/:department
 * - 특정 학과 내 랭킹 데이터를 반환
 * - department 파라미터 기반으로 필터링된 랭킹 반환
 */
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

/**
 * [PATCH] /api/change-nickname
 * - 사용자 닉네임(이름)을 변경합니다.
 * - 세션에서 사용자 ID 확인 후, 요청 body의 name 필드로 갱신
 * - 내부적으로 service.updateNickname(userId, newName) 호출
 */
export async function changeNickname(req, res, next) {
  try {
    const userId = req.session.user?.id;
    const { name: newName } = req.body;

    console.log('📥 클라이언트 닉네임 요청:', { userId, newName }); // 여기 로그도 추가

    if (!userId || !newName) {
      throw new AppError('닉네임 변경 요청이 잘못되었습니다.', 400);
    }

    const updated = await updateNickname(userId, newName);  //db에 업데이트
    res.json({ success: true, updated });
  } catch (err) {
    next(err);
  }
}

/**
 * [POST] /api/refresh
 * - Solved.ac API로부터 최신 문제 해결 정보를 가져와 DB에 갱신
 * - 한 명의 사용자에 대해 문제 목록을 동기화
 */
export async function refreshSolvedInfoSessionCtrl(req, res, next) {
    try {
        const userId = Number(req.session?.user?.id);
        await syncSingleUser(userId);             // Solved.ac <-> DB 
        res.status(200).json({ ok: true });
    } catch (error) {
        next(error);
    }
}
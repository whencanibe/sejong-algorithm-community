import * as service from '../services/postService.js';
import { AppError } from '../errors/AppError.js';

/**
 * [GET] /posts
 * - 전체 게시글 목록을 가져옴
 * - service.listPosts() 호출 → 모든 게시글 + 작성자 이름 포함 반환
 */
export async function getAllPosts(req, res, next) {
  try {
    const posts = await service.listPosts();
    res.json(posts);
  } catch (err) {
    next(err);
  }
}

/**
 * [GET] /posts/:id
 * - 특정 게시글 상세 정보 조회
 * - 글이 없으면 404 반환
 */
export async function getPost(req, res, next) {
  try {
    const post = await service.readPost(req.params.id);
    if (!post) return res.status(404).json({ error: '글이 없습니다' });
    res.json(post);
  } catch (err) {
    next(err);
  }
}

/**
 * [POST] /posts
 * - 로그인한 사용자가 새로운 글 작성
 * - 세션에서 user.id를 꺼내고, 글 데이터는 req.body에서 받음
 * - service.writePost(data, userId) 호출
 */
export async function createPost(req, res, next) {
  try {
    const userId = req.session?.user?.id;
    if (!userId) {
      return next(new AppError('로그인이 필요합니다', 401));
    }

    const newPost = await service.writePost(req.body, userId);
    res.status(201).json(newPost);
  } catch (err) {
    next(err);
  }
}

/**
 * [PUT] /posts/:id
 * - 기존 게시글 수정
 * - 작성자 본인만 수정 가능
 */
export async function updatePost(req, res, next) {
  try {
    const postId = Number(req.params.id);
    const userId = req.session?.user?.id;

    if (!userId) {
      return next(new AppError('로그인이 필요합니다', 401));
    }

    const post = await service.readPost(postId);
    if (!post) {
      return next(new AppError('게시글을 찾을 수 없습니다', 404));
    }

    // 작성자 확인
    if (post.userId !== userId) {
      return next(new AppError('수정 권한이 없습니다', 403));
    }

    const updated = await service.editPost(postId, req.body);
    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
}

/**
 * [DELETE] /posts/:id
 * - 게시글 삭제 요청
 * - 작성자 본인만 삭제 가능
 */
export async function deletePost(req, res, next) {
  try {
    const postId = Number(req.params.id);
    const userId = req.session?.user?.id;

    if (!userId) {
      return next(new AppError('로그인이 필요합니다', 401));
    }

    const post = await service.readPost(postId);
    if (!post) {
      return next(new AppError('게시글을 찾을 수 없습니다', 404));
    }

    // 작성자 확인
    if (post.userId !== userId) {
      return next(new AppError('삭제 권한이 없습니다', 403));
    }

    await service.removePost(postId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

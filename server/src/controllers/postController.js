import * as service from '../services/postService.js';

/**
 * [GET] /posts
 * - 전체 게시글 목록을 가져옴
 * - service.listPosts() 호출 → 모든 게시글 + 작성자 이름 포함 반환
 */
export async function getAllPosts(req, res) {
  try {
    const posts = await service.listPosts();
    res.json(posts);
  } catch (err) {
    next(err);  // 에러 미들웨어로 전달
  }
}

/**
 * [GET] /posts/:id
 * - 특정 게시글 상세 정보 조회
 * - 글이 없으면 404 반환
 */
export async function getPost(req, res) {
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
export async function createPost(req, res) {
  try {
    const userId = req.session?.user?.id;
    if (!userId) {
      return res.status(401).json({ error: '로그인이 필요합니다' });
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
 * - 본인 글인지 확인 로직은 service에서 처리 (권한 체크는 별도로 추가 가능)
 */
export async function updatePost(req, res) {
  try {
    const updated = await service.editPost(req.params.id, req.body);
    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
}

/**
 * [DELETE] /posts/:id
 * - 게시글 삭제 요청
 * - 세션에서 로그인 유저의 ID 확인 후 삭제 진행
 * - 글이 존재하는지 여부만 사전 확인
 */
export async function deletePost(req, res) {
  try {
    const postId = Number(req.params.id); //게시글 아이디
    const userId = req.session.user?.id; // 세션에서 로그인한 사용자 ID 가져오기
    const post = await service.readPost(postId); // 해당 글 정보 불러오기 
    await service.removePost(postId); //글 삭제
    res.status(204).send(); //정보 없음
  } catch (err) {
    next(err);
  }
}

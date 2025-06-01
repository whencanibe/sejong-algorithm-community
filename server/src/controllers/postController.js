import * as service from '../services/postService.js';

export async function getAllPosts(req, res) {
  try {
    const posts = await service.listPosts();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getPost(req, res) {
  try {
    const post = await service.readPost(req.params.id);
    if (!post) return res.status(404).json({ error: '글이 없습니다' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function createPost(req, res) {
  try {
    const newPost = await service.writePost(req.body);
    res.status(201).json(newPost);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function updatePost(req, res) {
  try {
    const updated = await service.editPost(req.params.id, req.body);
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}
export async function deletePost(req, res) {
  try {
    const postId = Number(req.params.id);
    const userId = req.session.user?.id; // ✅ 세션에서 로그인한 사용자 ID 가져오기

    const post = await service.readPost(postId); // 해당 글 정보 불러오기

   
    await service.removePost(postId);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

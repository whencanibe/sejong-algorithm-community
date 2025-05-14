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
    await service.removePost(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
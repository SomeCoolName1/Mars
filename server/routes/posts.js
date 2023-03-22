import express from "express";
import { verify } from "jsonwebtoken";
import {
  getUserPosts,
  getPosts,
  likePost,
  getLikedPosts,
  deletePost,
  updatePost,
  createComment,
  getFriendPosts,
} from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/", verifyToken, getPosts);
router.get("/:userID/posts", verifyToken, getUserPosts);
router.get("/:userID/posts/liked", verifyToken, getLikedPosts);
router.get("/:userID/posts/friends", verifyToken, getFriendPosts);

router.patch("/:ID/like", verifyToken, likePost);
router.delete("/:ID/delete", verifyToken, deletePost);

//Comments
router.post("/:postID/comment/", verifyToken, createComment);

export default router;

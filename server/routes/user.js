import express from "express";
import {
  getUserFriends,
  getUser,
  updateFriend,
  getFriendSuggestions,
} from "../controllers/user.js";
import { verifyToken } from "../middleware/auth.js";

// router.patch("/:ID", verifyToken, updatePost);

const router = express.Router();
router.get("/:userID", verifyToken, getUser);
router.get("/:userID/friends", verifyToken, getUserFriends);
router.get("/:userID/friends/suggestions", verifyToken, getFriendSuggestions);
router.patch("/:userID/friends", verifyToken, updateFriend);

export default router;

const express = require("express");
const postRoutes = express.Router();
const {
  createPostCtrl,
  fetchAllPostsCtrl,
  fetchPostCtrl,
  deletePostCtrl,
  updatePostCtrl,
  likePostCtrl,
  disLikePostCtrl,
} = require("../controllers/post/postCtrl");
const authMiddleware = require("../middleware/auth/authMiddleware");
const {
  uploadImageProfile,
  profilePhotoResize,
} = require("../middleware/uploads/uploadImage");

postRoutes.post(
  "/create",
  authMiddleware,
  uploadImageProfile.single("image"),
  profilePhotoResize,
  createPostCtrl
);
postRoutes.get("/fetch-all", authMiddleware, fetchAllPostsCtrl);
postRoutes.get("/fetch-post/:id", authMiddleware, fetchPostCtrl);
// postRoutes.post("/create", authMiddleware, createPostCtrl);
postRoutes.put("/like", authMiddleware, likePostCtrl);
postRoutes.put("/dislike", authMiddleware, disLikePostCtrl);
postRoutes.delete("/delete-post/:id", authMiddleware, deletePostCtrl);
postRoutes.put(
  "/update-post/:id",
  authMiddleware,
  uploadImageProfile.single("image"),
  profilePhotoResize,
  updatePostCtrl
);

module.exports = postRoutes;

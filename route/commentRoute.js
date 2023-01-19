const express = require("express");
const commentRoute = express.Router();
const {
  createCommentCtrl,
  fetchAllCommentsCtrl,
  deleteCommentCtrl,
  updateCommentCtrl,
} = require("../controllers/comment/commentCtrl");
const authMiddleware = require("../middleware/auth/authMiddleware");

commentRoute.post("/create", authMiddleware, createCommentCtrl);
commentRoute.get("/fetch-all", fetchAllCommentsCtrl);
commentRoute.delete("/delete/:id", authMiddleware, deleteCommentCtrl);
commentRoute.put("/update/:id", authMiddleware, updateCommentCtrl);

module.exports = commentRoute;

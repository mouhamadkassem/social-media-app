const express = require("express");
const userRoute = express.Router();
const {
  userRegisterCtrl,
  userLoginCtrl,
  fetchAllUserCtrl,
  fetchUserDetailsCtrl,
  followUserCtrl,
  unfollowUserCtrl,
  blockUserCtrl,
  unblockUsercCtrl,
  updateProfileCtrl,
  uploadProfilePhoto,
  fetchProfileDetailsCtrl,
} = require("../controllers/user/userCtrl");
const {
  uploadImageProfile,
  profilePhotoResize,
} = require("../middleware/uploads/uploadImage");
const authMiddleware = require("../middleware/auth/authMiddleware");

userRoute.post("/register", userRegisterCtrl);
userRoute.post("/login", userLoginCtrl);
userRoute.get("/fetch-users", fetchAllUserCtrl);
userRoute.put("/follow", authMiddleware, followUserCtrl);
userRoute.put("/unfollow", authMiddleware, unfollowUserCtrl);
userRoute.put("/block-user", authMiddleware, blockUserCtrl);
userRoute.put("/unblock-user", authMiddleware, unblockUsercCtrl);
userRoute.put("/update-profile", authMiddleware, updateProfileCtrl);
userRoute.put(
  "/uploadProfile-img",
  authMiddleware,
  uploadImageProfile.single("image"),
  profilePhotoResize,
  uploadProfilePhoto
);
userRoute.get("/details/:id", authMiddleware, fetchUserDetailsCtrl);
userRoute.get("/login-user", authMiddleware, fetchProfileDetailsCtrl);

module.exports = userRoute;

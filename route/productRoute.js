const express = require("express");
const productRoute = express.Router();
const {
  createProduct,
  viewsProductCtrl,
  fetchProductsCtrl,
  fetchProductsCategory,
  fetchProductDetails,
  addRatingCtrl,
  deleteProductCtrl,
} = require("../controllers/product/productCtrl");
const authMiddleware = require("../middleware/auth/authMiddleware");
const {
  uploadImageProfile,
  profilePhotoResize,
} = require("../middleware/uploads/uploadImage");

productRoute.post(
  "/",
  authMiddleware,
  uploadImageProfile.array("images", 3),
  profilePhotoResize,
  createProduct
);
productRoute.get("/", authMiddleware, fetchProductsCtrl);
productRoute.get("/category", authMiddleware, fetchProductsCategory);
productRoute.get("/details/:id", authMiddleware, fetchProductDetails);
productRoute.put("/rating", authMiddleware, addRatingCtrl);
productRoute.put("/views/:id", authMiddleware, viewsProductCtrl);
productRoute.delete("/:id", authMiddleware, deleteProductCtrl);

module.exports = productRoute;

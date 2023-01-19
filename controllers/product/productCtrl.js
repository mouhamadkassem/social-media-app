const expressAsyncHandler = require("express-async-handler");
const Product = require("../../model/product/Product");
const fs = require("fs");
const uploadImgToCloudinay = require("../../utils/cloudinary");

const createProduct = expressAsyncHandler(async (req, res) => {
  const UserLogin = req.user._id;
  let images = [];

  const imagesLocalPath = req.files?.map(
    (file) => `public/image/profile/${file.filename}`
  );

  const upload = async (num) => {
    let imgToUpload = await uploadImgToCloudinay(imagesLocalPath[num])
      .then((res) => {
        images.push(res.url);
      })
      .then(async () => {
        if (images.length === imagesLocalPath.length) {
          try {
            const product = await Product.create({
              user: UserLogin,
              imgs: images,
              ...req.body,
            });
            res.json(product);
            imagesLocalPath?.map((path) => fs.unlinkSync(path));
          } catch (error) {
            res.json(error);
          }
        }
      });
  };

  for (i = 0; i < imagesLocalPath?.length; i++) {
    upload(i);
  }
});

const fetchProductsCtrl = expressAsyncHandler(async (req, res) => {
  try {
    const product = await Product.find().sort("-createAt").populate("user");
    res.json(product);
  } catch (error) {
    res.json(error);
  }
});

const fetchProductsCategory = expressAsyncHandler(async (req, res) => {
  const { category } = req.query;
  try {
    const product = await Product.find({
      category: { $in: category },
    }).populate("user");
    res.json(product);
  } catch (error) {
    res.json(error);
  }
});
const fetchProductDetails = expressAsyncHandler(async (req, res) => {
  const productId = req.params.id;
  try {
    const product = await Product.findById(productId).populate("user");
    res.json(product);
  } catch (error) {
    res.json(error);
  }
});

const viewsProductCtrl = expressAsyncHandler(async (req, res) => {
  const userLogin = req.user.id;
  const productId = req.params.id;

  try {
    const productViewed = await Product.findByIdAndUpdate(
      productId,
      {
        $addToSet: { views: userLogin },
      },
      { new: true }
    );
    res.json(productViewed);
  } catch (error) {
    res.json(error);
  }
});

const addRatingCtrl = expressAsyncHandler(async (req, res) => {
  const userLogin = req.user._id;
  const { newRating, productId } = req.body;
  let num = 0;
  let n = 0;

  const { isRated, rating } = await Product.findById(productId);
  const isExist = isRated?.filter(
    (user) => user.toString() === userLogin.toString()
  );

  if (isRated?.length === 0 || !rating) {
    num = 1;
  } else {
    num = isRated.length + 1;
    n = rating;
  }

  const rate = (n * (num - 1) + +newRating) / num;

  if (isExist?.length) {
    throw new Error("you are rated already");
  }

  try {
    const product = await Product.findByIdAndUpdate(
      productId,
      {
        $set: { rating: rate },
        $push: { isRated: userLogin },
      },
      {
        new: true,
      }
    );
    res.json(product);
  } catch (error) {
    res.json(error);
  }
});

const deleteProductCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const delProduct = await Product.findByIdAndDelete(id);
    res.json(delProduct);
  } catch (error) {
    res.json(error);
  }
});

module.exports = {
  createProduct,
  viewsProductCtrl,
  fetchProductsCtrl,
  fetchProductsCategory,
  fetchProductDetails,
  addRatingCtrl,
  deleteProductCtrl,
};

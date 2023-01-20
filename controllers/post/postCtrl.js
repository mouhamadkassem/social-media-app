const Post = require("../../model/post/Post");
const fs = require("fs");
const expressAsyncHandler = require("express-async-handler");
const uploadImgToCloudinay = require("../../utils/cloudinary");

//_______________________
// create post
//_______________________
const createPostCtrl = expressAsyncHandler(async (req, res) => {
  const userLogin = req?.user?._id;

  const { image, description } = req?.body;

  const localpath = `public/image/profile/${req.file.filename}`;

  const imgToUpload = await uploadImgToCloudinay(localpath);

  try {
    const post = await Post.create({
      image: imgToUpload?.url,
      description: description,
      user: userLogin,
    });
    res.json(post);
    fs.unlinkSync(localpath);
  } catch (error) {
    console.log(error);
    res.json(error);
  }
});

//_______________________
// fetch all posts
//_______________________

const fetchAllPostsCtrl = expressAsyncHandler(async (req, res) => {
  try {
    const posts = await Post.find({})
      .populate("user")
      .populate("comment")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.json(error);
  }
});
//_______________________
// fetch  post
//_______________________

const fetchPostCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findById(id)
      .populate("user")
      .populate({ path: "comment", populate: { path: "user" } });

    res.json(post);
  } catch (error) {
    res.json(error);
  }
});
//_______________________
// delete  post
//_______________________

const deletePostCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findByIdAndDelete(id);
    res.json(post);
  } catch (error) {
    res.json(error);
  }
});
//_______________________
// update  post
//_______________________

const updatePostCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const { description } = req.body;

  const localpath = `public/image/profile/${req?.file?.filename}`;

  const imgToUpload = await uploadImgToCloudinay(localpath);
  try {
    const post = await Post.findByIdAndUpdate(
      id,
      {
        image: imgToUpload?.url,
        description,
      },
      {
        new: true,
      }
    );
    fs.unLinkSync(localpath);
    res.json(post);
  } catch (error) {
    res.json(error);
  }
});

//_______________________
// like  post
//_______________________

const likePostCtrl = expressAsyncHandler(async (req, res) => {
  const likePost = req.body.id;
  const loginUserId = req.user._id;

  try {
    const postToLike = await Post.findById(likePost);
    const { likes } = postToLike;

    const isLiked = likes?.find(
      (user) => user.toString() === loginUserId.toString()
    );

    if (isLiked) {
      const unLiked = await Post.findByIdAndUpdate(
        likePost,
        { $pull: { likes: loginUserId } },
        { new: true }
      );
      res.json(unLiked);
    } else {
      const like = await Post.findByIdAndUpdate(
        likePost,
        {
          $push: {
            likes: loginUserId,
          },
          $pull: {
            disLikes: loginUserId,
          },
        },
        { new: true }
      );
      res.json(like);
    }
  } catch (error) {
    res.json(error);
  }
});
//_______________________
// dislike  post
//_______________________

const disLikePostCtrl = expressAsyncHandler(async (req, res) => {
  const disLikePost = req.body.id;
  const loginUserId = req.user._id;

  try {
    const postToLike = await Post.findById(disLikePost);
    const { disLikes } = postToLike;

    const isDisLiked = disLikes?.find(
      (user) => user.toString() === loginUserId.toString()
    );

    if (isDisLiked) {
      const unDisLiked = await Post.findByIdAndUpdate(
        disLikePost,
        { $pull: { disLikes: loginUserId } },
        { new: true }
      );
      res.json(unDisLiked);
    } else {
      const dislike = await Post.findByIdAndUpdate(
        disLikePost,
        {
          $push: {
            disLikes: loginUserId,
          },
          $pull: {
            likes: loginUserId,
          },
        },
        { new: true }
      );
      res.json(dislike);
    }
  } catch (error) {
    res.json(error);
  }
});

module.exports = {
  createPostCtrl,
  fetchAllPostsCtrl,
  fetchPostCtrl,
  deletePostCtrl,
  updatePostCtrl,
  likePostCtrl,
  disLikePostCtrl,
};

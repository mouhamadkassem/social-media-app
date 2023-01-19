const Comment = require("../../model/comment/Comment");
const expressAsyncHandler = require("express-async-handler");

//_______________________
// create comment
//_______________________
const createCommentCtrl = expressAsyncHandler(async (req, res) => {
  const { description, post } = req.body;
  const userId = req.user._id;
  try {
    const comment = await Comment.create({
      description,
      user: userId,
      post,
    });
    res.json(comment);
  } catch (error) {
    res.json(error);
  }
});

//_______________________
// fetch comments
//_______________________

const fetchAllCommentsCtrl = expressAsyncHandler(async (req, res) => {
  try {
    const comments = await Comment.find({}).populate("user").populate("post");

    res.json(comments);
  } catch (error) {
    res.json(error);
  }
});

//_______________________
// delete comment
//_______________________
const deleteCommentCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const comment = await Comment.findByIdAndDelete(id);
    res.json(comment);
  } catch (error) {
    res.json(error);
  }
});

//_______________________
// update comment
//_______________________
const updateCommentCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const { description } = req.body;
  try {
    const comment = await Comment.findByIdAndUpdate(
      id,
      { description: description },
      { new: true }
    );
    res.json(comment);
  } catch (error) {
    res.json(error);
  }
});

module.exports = {
  createCommentCtrl,
  fetchAllCommentsCtrl,
  deleteCommentCtrl,
  updateCommentCtrl,
};

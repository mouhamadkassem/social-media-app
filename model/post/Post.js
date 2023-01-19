const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: [true, "the image is required"],
    },
    description: {
      type: String,
      required: [true, "the description is required"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    likes: {
      type: [{ type: mongoose.Schema.Types.ObjectId }],
    },
    disLikes: {
      type: [{ type: mongoose.Schema.Types.ObjectId }],
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
    timestamps: true,
  }
);

/////////////////////////////////////////////////////
// virtual post
postSchema.virtual("comment", {
  ref: "Comment",
  foreignField: "post",
  localField: "_id",
});

//compile

const Post = mongoose.model("Post", postSchema);

module.exports = Post;

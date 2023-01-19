const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "firstName is required"],
    },
    lastName: {
      type: String,
      required: [true, "lastName is required"],
    },
    email: {
      type: String,
      required: [true, "email is required"],
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
    profilePhoto: {
      type: String,
      default:
        "https://th.bing.com/th/id/R.6300042a143b113848423e8ca965b29d?rik=UnYMpB8ljmvneg&pid=ImgRaw&r=0",
    },
    bio: {
      type: String,
    },

    isblocked: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    },

    isFollowing: {
      type: Boolean,
      default: false,
    },
    followers: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    },
    following: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    },
    accountVerificationToken: String,
    accountVerificationTokenExpires: Date,

    passwordChangeAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    isUnFollowing: {
      type: Boolean,
      default: false,
    },
    isAccountVerfied: {
      type: Boolean,
      default: false,
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
userSchema.virtual("posts", {
  ref: "Post",
  foreignField: "user",
  localField: "_id",
});

////////////////////////////////////////////////////
// hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/////////////////////////////////////////////////////
// match password
userSchema.methods.ifPasswordMatch = async function (password) {
  const isMatch = await bcrypt.compare(password, this.password);

  return isMatch;
};

const User = mongoose.model("User", userSchema);

module.exports = User;

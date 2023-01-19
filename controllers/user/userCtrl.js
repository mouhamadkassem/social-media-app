const User = require("../../model/user/User");
const expressAsyncHandler = require("express-async-handler");
const generateToken = require("../../middleware/token/generateToken");
const uploadImgToCloudinay = require("../../utils/cloudinary");
const fs = require("fs");

//_______________________
// user register
//_______________________

const userRegisterCtrl = expressAsyncHandler(async (req, res) => {
  const data = req?.body;

  try {
    const user = await User.create({
      firstName: data?.firstName,
      lastName: data?.lastName,
      email: data?.email,
      password: data?.password,
    });

    res.json(user);
  } catch (error) {
    res.json(error);
  }
});

//_______________________
// user login
//_______________________

const userLoginCtrl = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const userLogin = await User.findOne({ email: req.body.email });

  if (!userLogin) {
    throw new Error("check your email");
  }

  const isMatch = await userLogin?.ifPasswordMatch(password);

  if (userLogin && isMatch) {
    try {
      res.json({
        firstName: userLogin?.firstName,
        lastName: userLogin?.lastName,
        email: userLogin?.email,
        id: userLogin?._id,
        isblocked: userLogin?.isblocked,
        photo: userLogin?.profilePhoto,
        token: await generateToken(userLogin?._id),
      });
    } catch (error) {
      res.json(error);
    }
  } else {
    throw new Error("check your password or email");
  }
});

//_______________________
// fetch All user
//_______________________

const fetchAllUserCtrl = expressAsyncHandler(async (req, res) => {
  try {
    const users = await User.find({}).populate("posts");
    res.json(users);
  } catch (error) {
    res.json(error);
  }
});

//_______________________
// fetch user details
//_______________________

const fetchUserDetailsCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id)
      .populate("isblocked")
      .populate("posts")
      .populate("followers")
      .populate("following");

    res.json(user);
  } catch (error) {
    res.json(error);
  }
});
//_______________________
// fetch user profile details
//_______________________

const fetchProfileDetailsCtrl = expressAsyncHandler(async (req, res) => {
  const id = req.user._id;
  try {
    const user = await User.findById(id)
      .populate("isblocked")
      .populate("followers")
      .populate("following")
      .populate("posts");

    res.json(user);
  } catch (error) {
    res.json(error);
  }
});

//_______________________
// follow user
//_______________________

const followUserCtrl = expressAsyncHandler(async (req, res) => {
  const followId = req.body.id;
  const loginId = req.user._id;

  const toFollow = await User.findById(followId);

  const { followers } = toFollow;

  const isFollow = followers?.find(
    (id) => id.toString() === loginId.toString()
  );

  if (isFollow) throw new Error("you already follow this user");

  try {
    const follow = await User.findByIdAndUpdate(
      followId,
      { $push: { followers: loginId } },
      {
        new: true,
      }
    );
    const following = await User.findByIdAndUpdate(
      loginId,
      { $push: { following: followId } },
      {
        new: true,
      }
    );
    res.json(following);
  } catch (error) {
    res.json(error);
  }
});
const unfollowUserCtrl = expressAsyncHandler(async (req, res) => {
  const unfollowId = req.body.id;
  const loginId = req.user._id;

  const toUnFollow = await User.findById(unfollowId);

  const { followers } = toUnFollow;

  const isFollow = followers?.find(
    (id) => id.toString() === loginId.toString()
  );

  if (isFollow) {
    try {
      const follow = await User.findByIdAndUpdate(
        unfollowId,
        { $pull: { followers: loginId } },
        {
          new: true,
        }
      );
      const following = await User.findByIdAndUpdate(
        loginId,
        { $pull: { following: unfollowId } },
        {
          new: true,
        }
      );
      res.json(follow);
    } catch (error) {
      res.json(error);
    }
  } else res.json("you already unfollow this");
});

//_______________________
// block user
//_______________________

const blockUserCtrl = expressAsyncHandler(async (req, res) => {
  const { isblocked, _id } = req?.user;
  const blockUser = req?.body?.id;

  const checkIfIsBlocked = isblocked?.find(
    (blocked) => blocked?.toString() === blockUser
  );

  if (checkIfIsBlocked) {
    throw new Error("your already block this user");
  } else {
    try {
      const blockIt = await User.findByIdAndUpdate(
        _id,
        {
          $push: { isblocked: blockUser },
        },
        { new: true }
      );
      res.json(blockIt);
    } catch (error) {
      res.json(error);
    }
  }
});

//_______________________
// unblock user
//_______________________

const unblockUsercCtrl = expressAsyncHandler(async (req, res) => {
  const { isblocked, _id } = req.user;
  const unblockUser = req.body?.id;

  try {
    const unblock = await User.findByIdAndUpdate(
      _id,
      {
        $pull: {
          isblocked: unblockUser,
        },
      },
      { new: true }
    );
    res.json(unblock);
  } catch (error) {
    res.json(error);
  }
});

//_______________________
// update profile of user
//_______________________

const updateProfileCtrl = expressAsyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { firstName, lastName, bio } = req.body;

  try {
    const updateProfile = await User.findByIdAndUpdate(
      _id,
      {
        firstName,
        lastName,
        bio,
      },
      { new: true }
    );
    res.json(updateProfile);
  } catch (error) {
    res.json(error);
  }
});

//_______________________
// upload profile image
//_______________________

const uploadProfilePhoto = expressAsyncHandler(async (req, res) => {
  // get the path of image
  const localpath = `public/image/profile/${req.file.filename}`;

  // upload the image to cloudinary
  const imgUploaded = await uploadImgToCloudinay(localpath);

  try {
    const { _id } = req.user;

    const user = await User.findByIdAndUpdate(
      _id,
      {
        profilePhoto: imgUploaded?.url,
      },
      { new: true }
    );

    fs.unlinkSync(localpath);
    res.json(user);
  } catch (error) {
    res.json(error);
  }
});

module.exports = {
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
};

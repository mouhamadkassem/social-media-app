const Chat = require("../../model/chat/chat");
const expressAsyncHandler = require("express-async-handler");

const joinChatCtrl = expressAsyncHandler(async (req, res) => {
  const userLoginId = req?.user?._id;

  const userToChat = req.body.id;

  if (!userLoginId || !userToChat) {
    throw new Error("the two users is required");
  }

  try {
    const chat = await Chat.find({
      $and: [
        { users: { $elemMatch: { $eq: userLoginId } } },
        { users: { $elemMatch: { $eq: userToChat } } },
      ],
    })
      .populate("users")
      .populate("messages");

    if (!chat.length) {
      const newChat = await Chat.create({
        users: [userLoginId, userToChat],
      });
      res.json(newChat);
    } else {
      res.json(chat[0]);
    }
  } catch (error) {
    res.json(error);
  }
});

module.exports = { joinChatCtrl };

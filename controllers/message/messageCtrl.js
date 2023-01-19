const expressAsyncHandler = require("express-async-handler");
const Message = require("../../model/message/message");

const createMessageCtrl = expressAsyncHandler(async (req, res) => {
  const { content, chatId } = req.body;
  const userLoginId = req.user._id;

  if (!content || !chatId) {
    throw new Error("you data is not complete");
  }

  try {
    const message = await Message.create({
      sender: userLoginId,
      content,
      chat: chatId,
    });
    res.json(message);
  } catch (error) {
    res.json(error);
  }
});

module.exports = { createMessageCtrl };

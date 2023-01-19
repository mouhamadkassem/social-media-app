const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    users: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ],
  },

  {
    timestamps: true,
    toObject: {
      virtuals: true,
    },
    toJSON: {
      virtuals: true,
    },
  }
);

chatSchema.virtual("messages", {
  ref: "Message",
  foreignField: "chat",
  localField: "_id",
});

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;

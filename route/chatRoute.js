const express = require("express");

const chatRoute = express.Router();

const { joinChatCtrl } = require("../controllers/chat/chatCtrl");
const authMiddleware = require("../middleware/auth/authMiddleware");

chatRoute.post("/create", authMiddleware, joinChatCtrl);

module.exports = chatRoute;

const express = require("express");

const messageRoute = express.Router();
const authMiddleware = require("../middleware/auth/authMiddleware");
const { createMessageCtrl } = require("../controllers/message/messageCtrl");

messageRoute.post("/send", authMiddleware, createMessageCtrl);

module.exports = messageRoute;

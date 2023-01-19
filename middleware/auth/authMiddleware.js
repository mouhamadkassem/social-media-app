const jwt = require("jsonwebtoken");
const expressAsyncHandler = require("express-async-handler");
const User = require("../../model/user/User");

const authMiddleware = expressAsyncHandler(async (req, res, next) => {
  let token;

  if (req?.headers?.authorization?.startsWith("bearer")) {
    token = req.headers.authorization.split(" ")[1];
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SUCCRET);
        const user = await User.findById(decoded?.id);
        req.user = user;
        next();
      } catch (error) {
        res.json("Not authorized token expired , login again ");
      }
    }
  } else {
    throw new Error("there is no token attach to header");
  }
});

module.exports = authMiddleware;

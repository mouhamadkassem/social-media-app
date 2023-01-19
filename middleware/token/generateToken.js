const jwt = require("jsonwebtoken");

const generateToken = async (id) => {
  const token = jwt.sign({ id }, process.env.JWT_SUCCRET, { expiresIn: "1d" });
  return token;
};

module.exports = generateToken;

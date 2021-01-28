const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports.generateToken = (user) => {
  const payload = {
    id: user._id,
  };

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1hr" });
};

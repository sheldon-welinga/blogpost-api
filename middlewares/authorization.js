const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = async (req, res, next) => {
  try {
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
};

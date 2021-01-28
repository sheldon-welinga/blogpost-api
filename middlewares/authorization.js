const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = async (req, res, next) => {
  try {
    //get token from the fetch request
    const token = req.header("token");
    if (!token) {
      return res.status(403).json({ error: "Not authorized" });
    } else {
      const payload = jwt.verify(token, process.env.JWT_SECRET);

      req.body.user_id = payload.id;

      next();
    }
  } catch (err) {
    if (err.message === "jwt expired") {
      res.status(499).json({
        error: "Your session has expired, please login to continue",
      });
    } else {
      res.status(403).json({ error: err.message });
    }
  }
};

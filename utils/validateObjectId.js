const mongoose = require("mongoose");

const validateObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

module.exports = { validateObjectId };

// MONGODB_URI = mongodb://localhost:27017/blogpost

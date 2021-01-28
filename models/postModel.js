const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    posted_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    post_content: { type: String, required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [
      {
        message: {
          type: String,
        },
        comment_by: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        comment_at: {
          type: Date,
          default: Date.now(),
        },
      },
    ],
    created_at: { type: Date, required: true, default: Date.now() },
  },
  { collection: "posts" }
);

module.exports = mongoose.model("Post", postSchema);

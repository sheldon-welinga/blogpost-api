const router = require("express").Router();
const authorization = require("../middlewares/authorization");
const { createPostValidation } = require("../middlewares/validations");
const Post = require("../models/postModel");
const { validateObjectId } = require("../utils/validateObjectId");

//get all posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find({}, { __v: 0 }).sort({ created_at: -1 });

    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

//create a new post
router.post("/new", createPostValidation, authorization, async (req, res) => {
  try {
    //   1. destructure the post_content from req.body
    const { user_id, post_content } = req.body;

    //2. create a new post
    const newPost = new Post({
      posted_by: user_id,
      post_content,
    });

    await newPost.save();

    res.status(201).json({
      message: "Post created successfully",
      post_id: newPost._id,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

//like a post
router.patch("/:post_id/like", authorization, async (req, res) => {
  try {
    //1. destructure the user_id(user liking id) from req.body and
    // post_id (post to be liked id) from req.params
    const { user_id } = req.body;
    const { post_id } = req.params;

    //2. validate the post id
    if (validateObjectId(post_id)) {
      //3. check if the post to be liked exists exists
      const post = await Post.findById({ _id: post_id });

      if (!post) {
        res.status(404).json({ error: "The post doesn't exist!" });
      } else {
        //check if the user has already liked the post

        const is_liked = post.likes.find(
          (post_user_id) => post_user_id == user_id
        );

        if (is_liked) {
          res.status(409).json({
            error: "You already liked the post",
          });
        } else {
          //update the new like if for the post if not liked
          post.likes = [...post.likes, user_id];

          post.save();

          res.status(200).json({
            message: "You successfully liked the post",
          });
        }
      }
    } else {
      res.status(406).json({ error: "Invalid post_id" });
    }
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

//unlike a post
router.patch("/:post_id/unlike", authorization, async (req, res) => {
  try {
    //1. destructure the user_id(user unliking id) from req.body and
    // post_id (post to be unliked id) from req.params
    const { user_id } = req.body;
    const { post_id } = req.params;

    //2. validate the post id
    if (validateObjectId(post_id)) {
      //check if the post exists
      const post = await Post.findById({ _id: post_id });

      if (!post) {
        res.status(404).json({ error: "The post doesn't exist" });
      } else {
        //check if the user has already liked the post
        const is_liked = await post.likes.find(
          (post_user_id) => post_user_id == user_id
        );

        if (is_liked) {
          //remove a like if liked
          post.likes = post.likes.filter(
            (post_user_id) => post_user_id != user_id
          );

          post.save();

          res.status(200).json({
            message: "You successfully unliked the post!",
          });
        } else {
          res.status(409).json({
            error: "You have not liked the post yet!",
          });
        }
      }
    } else {
      res.status(406).json({ error: "Invalid post_id" });
    }
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

//delete a post
router.delete("/:post_id/delete", authorization, async (req, res) => {
  try {
    //1. destructure the post id from req.params
    const { post_id } = req.params;

    //2. check if valid object id
    if (validateObjectId(post_id)) {
      const post = await Post.findById({ _id: post_id });

      if (!post) {
        res.status(404).json({ error: "The post doesn't exist!" });
      } else {
        //3. delete the post from the database
        await post.remove();

        res.status(200).json({
          message: "Post deleted successfully!",
        });
      }
    } else {
      res.status(406).json({ error: "Invalid post_id" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//comment on a post
router.patch("/:post_id/comment", authorization, async (req, res) => {
  try {
    //1. destructure the message and user_id (user id commenting) from req.body and
    // post_id from req.params
    const { message, user_id } = req.body;
    const { post_id } = req.params;

    //check if valid object id
    if (validateObjectId(post_id)) {
      const post = await Post.findById({ _id: post_id });

      if (!post) {
        res.status(404).json({
          error: "The post doesn't exist",
        });
      } else {
        const newComment = {
          message,
          comment_by: user_id,
        };

        post.comments = [...post.comments, newComment];

        post.save();

        res.status(200).json({
          message: "Comment posted successfully",
        });
      }
    } else {
      res.status(406).json({ error: "Invalid post_id" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

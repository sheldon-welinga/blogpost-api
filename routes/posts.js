const router = require("express").Router();
const Post = require("../models/postModel");

router.get("/", async (req, res) => {
  try {
    const posts = await Post.find();

    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

//create a new post
router.post("/new", async (req, res) => {
  try {
    //   1. destructure the name, message from req.body
    const { posted_by, post_content } = req.body;

    //2. create a new post
    const newPost = new Post({
      posted_by,
      post_content,
    });

    await newPost.save();

    res.status(201).json({
      message: "Post created successfully",
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

//like a post
router.patch("/like", async (req, res) => {
  try {
    //1. destructure the id(user liking id) and post_id (post to be liked id) from req.body
    const { id, post_id } = req.body;

    //check if the user exists
    const post = await Post.findById({ _id: post_id });

    if (!post) {
      res.status(404).json({ error: "The post doesn't exist" });
    } else {
      //check if the user has already liked the post
      const is_liked = post.likes.find((postid) => postid == id);

      if (is_liked) {
        res.status(409).json({
          error: "User already liked the post",
        });
      } else {
        //add a new like if not liked
        const addLikes = [...post.likes, id];

        post.likes = addLikes;

        post.save();

        res.status(200).json({
          message: "You successfully liked the post",
        });
        //get the post to like
      }
    }
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

//unlike a post
router.patch("/unlike", async (req, res) => {
  try {
    //1. destructure the id(user unliking id) and post_id (post to be unliked id) from req.body
    const { id, post_id } = req.body;

    //check if the user exists
    const post = await Post.findById({ _id: post_id });

    if (!post) {
      res.status(404).json({ error: "The post doesn't exist" });
    } else {
      //check if the user has already liked the post
      const is_liked = await post.likes.find((postid) => postid == id);

      if (is_liked) {
        //remove a like if liked
        const removeLikes = await post.likes.filter((postid) => postid != id);

        post.likes = removeLikes;

        post.save();

        res.status(200).json({
          message: "You successfully unliked the post",
        });
      } else {
        res.status(409).json({
          error: "User has not liked the post",
        });
      }
    }
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

//delete a post
router.delete("/delete/:post_id", async (req, res) => {
  try {
    const { post_id } = req.params;

    const post = await Post.findById({ _id: post_id });

    if (!post) {
      res.status(404).json({ error: "The post doesn't exist!" });
    } else {
      await post.remove();

      res.status(200).json({
        message: "Post deleted successfully!",
      });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//comment on a post
router.patch("/comment", async (req, res) => {
  try {
    //destructure the message, post_id and comment_by (user id commenting) from req.body
    const { message, comment_by, post_id } = req.body;

    const post = await Post.findById({ _id: post_id });

    if (!post) {
      res.status(404).json({
        error: "The post doesn't exist",
      });
    } else {
      const { comments } = await post;

      const newComment = {
        message,
        comment_by,
        comment_at: Date.now(),
      };

      post.comments = [...comments, newComment];

      post.save();

      res.status(200).json({
        message: "Comment posted successfully",
      });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

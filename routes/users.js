const router = require("express").Router();
const bcrypt = require("bcryptjs");
const authorization = require("../middlewares/authorization");
const {
  userLoginValidation,
  userRegisterValidation,
} = require("../middlewares/validations");

const User = require("../models/userModel");
const { generateToken } = require("../utils/generateToken");
const { validateObjectId } = require("../utils/validateObjectId");

//register a user
router.post("/register", userRegisterValidation, async (req, res) => {
  try {
    //1. destructure the name, email, password from req.body
    const { name, email, password } = req.body;

    //2. get the user from the database
    const user = await User.findOne({ email });

    //3. check if the email is already registered if not register the user
    if (user) {
      res.status(409).json({ error: "Email address already registered!" });
    } else {
      //hash the password
      bcrypt.hash(password, 10, async (err, hashedPassword) => {
        if (err) {
          res.status(504).json({ error: err.message });
        } else {
          //create the new user and save to the database
          const newUser = new User({
            name,
            email,
            password: hashedPassword,
          });

          await newUser.save();

          //generate a token
          const token = await generateToken(newUser);

          //return the token and success message
          res.status(201).json({
            token,
            message: "Email registered successfully!",
          });
        }
      });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//login a user
router.post("/login", userLoginValidation, async (req, res) => {
  try {
    //1. destructure the email and password from req.body
    const { email, password } = req.body;

    //2. get the user from the database
    const user = await User.findOne({ email });

    //3. check if the user is not registered  and return an error else login
    if (!user) {
      res.status(404).json({
        error: "Email address is not registered!",
      });
    } else {
      //4. compare the password with the one in the database
      bcrypt.compare(password, user.password, async (err, validPassword) => {
        if (err) {
          res.status(504).json({ error: err.message });
        } else if (validPassword) {
          //generate a token
          const token = await generateToken(user);

          //return the token and success message
          res.status(200).json({
            token,
            message: "Login successfully!",
          });
        } else {
          res.status(401).json({ error: "Invalid email address or password" });
        }
      });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//reset a users password
router.patch("/reset-password", userLoginValidation, async (req, res) => {
  try {
    //1. destructure the email and new password from the req.body
    const { email, password } = req.body;

    //2. get the user details from the database
    const user = await User.findOne({ email });

    //3. check if user is not registered an return error else reset the password
    if (!user) {
      res.status(404).json({ error: "Email address is not registered!" });
    } else {
      //hash the password
      bcrypt.hash(password, 10, async (err, hashedPassword) => {
        if (err) {
          res.status(504).json({ error: err.message });
        } else {
          const editUser = user;
          editUser.password = hashedPassword;

          await editUser.save();

          //generate a token
          const token = generateToken(editUser);

          //return token and success message
          res.status(200).json({
            token,
            message: "Password changed successfully",
          });
        }
      });
    }
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

//get all users
router.get("/", authorization, async (req, res) => {
  try {
    let users = await User.find();

    users = users.map((user) => {
      const single_user = {
        user_id: user._id,
        name: user.name,
        email: user.email,
      };

      return single_user;
    });

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

//follow a user
router.patch("/:follower_id/follow", authorization, async (req, res) => {
  try {
    // destructure the user_id(The one to follow another) from req.body and
    //follower_id (The one to be followed) from req.params
    const { user_id } = req.body;
    const { follower_id } = req.params;

    if (validateObjectId(follower_id)) {
      if (user_id === follower_id) {
        res.status(504).json({ error: "User's cant follow themselves" });
      } else {
        const user = await User.findById({ _id: user_id });

        if (!user) {
          res.status(404).json({
            error: "User doen't exist",
          });
        } else {
          const followerUser = await User.findById({ _id: follower_id });

          if (!followerUser) {
            res.status(422).json({
              error: "The user you are trying to follow doesn't exist",
            });
          } else {
            //check if user is already following the other party
            const is_following = await user.following.find(
              (followerid) => followerid == follower_id
            );

            if (is_following) {
              res.status(409).json({
                error: "You are already following the user",
              });
            } else {
              //update the records of the follower under the users following
              user.following = [...user.following, follower_id];

              //update the records for the follower under their followers
              followerUser.followers = [...followerUser.followers, user_id];

              await user.save();

              await await followerUser.save();

              res.status(200).json(user);
            }
          }
        }
      }
    } else {
      res.status(406).json({ error: "Invalid follower_id" });
    }
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

//unfollow a user
router.patch("/:follower_id/unfollow", authorization, async (req, res) => {
  try {
    // destructure the user id(The current user following another)  from req.body
    // and follower_id (The one who is being followed) from req.params
    const { user_id } = req.body;
    const { follower_id } = req.params;

    if (validateObjectId(follower_id)) {
      if (user_id === follower_id) {
        res.status(504).json({
          error: "User's can't unfollow themselves",
        });
      } else {
        const user = await User.findById({ _id: user_id });

        if (!user) {
          res.status(404).json({
            error: "User doen't exist",
          });
        } else {
          const followerUser = await User.findById({ _id: follower_id });

          if (!followerUser) {
            res.status(422).json({
              error: "The user you are trying to unfollow doesn't exist",
            });
          } else {
            //check if user is already following the other party
            const is_following = await user.following.find(
              (followerid) => followerid == follower_id
            );

            if (!is_following) {
              res.status(409).json({
                error:
                  "You are trying to unfollow a user you aren't following!",
              });
            } else {
              //update the records of the follower under the users following
              const user_following = user.following.filter(
                (followerid) => followerid != follower_id
              );

              //update the records for the follower under their followers
              const follower_followers = followerUser.followers.filter(
                (userid) => userid != user_id
              );

              user.following = user_following;

              followerUser.followers = follower_followers;

              await user.save();

              await await followerUser.save();

              res.status(200).json(user);
            }
          }
        }
      }
    } else {
      res.status(406).json({ error: "Invalid follower_id" });
    }
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

module.exports = router;

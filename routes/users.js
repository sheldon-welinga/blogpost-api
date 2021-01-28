const router = require("express").Router();
const bcrypt = require("bcryptjs");
const {
  userLoginValidation,
  userRegisterValidation,
} = require("../middlewares/validations");

const User = require("../models/userModel");
const { generateToken } = require("../utils/generateToken");

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

router.patch("/follow", async (req, res) => {
  try {
    const { user_id } = req.body;
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

module.exports = router;

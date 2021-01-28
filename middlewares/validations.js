// validate all register user fields are available
module.exports.userRegisterValidation = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name) {
      res.status(422).json({ error: "name field cannot be blank" });
    } else if (!email) {
      res.status(422).json({ error: "email field cannot be blank" });
    } else if (!password) {
      res.status(422).json({ error: "password field cannot be blank" });
    } else {
      next();
    }
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

// Validate all login users fields are available
module.exports.userLoginValidation = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      res.status(422).json({ error: "email field cannot be blank" });
    } else if (!password) {
      res.status(422).json({ error: "password field cannot be blank" });
    } else {
      next();
    }
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

//create post validation of all fields
module.exports.createPostValidation = async (req, res, next) => {
  try {
    const { post_content } = req.body;

    if (!post_content) {
      res.status(422).json({ error: "post_content field cannot be blank" });
    }
    {
      next();
    }
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

const express = require("express");
const ExpressError = require("../helpers/expressError");
const {
  authenticateJWT,
  ensureAdmin,
  ensureCorrectUser,
} = require("../middleware/authenticate");
const User = require("../models/user");
const jsonSchema = require("jsonschema")
const userSchema = require("../schemas/userSchema")
const updateUserSchema = require("../schemas/updateUserSchema")
const token = require("../helpers/token")

const router = express.Router();


// GET - all users with filter

router.get("/", async (req, res, next) => {
  try {
    const result = await User.getAll(req.query);
    return res.json({ users: result });
  } catch (err) {
    return next(err);
  }
});

// GET - search username 

router.get("/:username", async (req, res, next) => {
  const username = req.params.username;
  try {
    const result = await User.getUser(username);
    return res.status(201).json({ user: result });
  } catch (err) {
    return next(err);
  }
});

// POST - register a new user  

router.post("/", async(req, res, next) => {
  let user = req.body
  let input = jsonSchema.validate(user, userSchema);  // validate inputs

  if (!input.valid) {
      let error = new ExpressError("Invalid user fields", 401)
      return next(error);
  }

  try {
    let registerUser = await User.register(user); // register user; add to db 
    const token = await getToken(registerUser); // get new JWT
    User.updateLoginTimestamp(registerUser.username); // update db login timestamp
    return res.json({ token });
  } catch (err) {
    return next(err);
  }
})

// PATCH - update user

router.patch("/:username", ensureCorrectUser, async(req, res, next) => {
  let username = req.params.username;
  let userData = req.body;

  let result = jsonSchema.validate(userData, updateUserSchema); // validate user inputs
  
  if (!result.valid) {
    let error = new ExpressError("Invalid user fields", 401);
    return next(error);
  }

  try {
    const result = await User.update(username, userData);
    return res.json({ updated: result });
  } catch (err) {
    return next(err);
  }
})


// DELETE - delete user 

router.delete("/:username", ensureCorrectUser, async(req, res, next) => {
  let username = req.params.username
  let password = req.body.password
  try {
    const result = await User.delete(username, password)
    return res.json({ message: 'User deleted' });
  } catch (err) {
    return next(err)
  }
})


module.exports = router;

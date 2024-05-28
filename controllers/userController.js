const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

//@desc Register a user
//@route POST /api/users/register
//@access public
const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory!!");
  }
  const userAvailable = await User.findOne({ email });
  if (userAvailable) {
    res.status(400);
    throw new Error("User already exists!!");
  }

  //Hashing the raw password
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log("Hashed Password", hashedPassword);
  const user = await User.create({
    username,
    email,
    password: hashedPassword,
  });
  console.log(`User created ${user}`);
  if (user) {
    res.status(201).json({ _id: user.id, email: user.email });
  } else {
    res.status(400);
    throw new Error("User not created!!");
  }
  res.json(user);
});

//@desc Login a user
//@route POST /api/users/login
//@access public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory!!");
  }

  const user = await User.findOne({ email });

  //Compare Password
  if (user && (await bcrypt.compare(password, user.password))) {
    // Create a JSON Web Token
    const accessToken = jwt.sign({
        user: {
          username: user.username,
          email: user.email,
          _id: user._id,
        },
      }, process.env.ACCESS_TOKEN_SECRET,{ expiresIn: "15m" });

    res.status(200).json({ accessToken });
  } else {
    res.status(401);
    throw new Error("Invalid email or password!!");
  }
});

//@desc Get user information
//@route GET /api/users/current
//@access private
const currentUser = asyncHandler(async (req, res) => {
  // console.log("CONTROLLER----------------->" ,req.user);
  res.json(req.user);
});

module.exports = {
  register,
  login,
  currentUser,
};

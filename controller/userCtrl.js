const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const { generateToken } = require("../config/jwtToken");
const createUser = asyncHandler(async (req, res) => {
  //* You cannot create a new user if they already exist. If you look at the user model then you can see the unique ID is for email, for this reason we are requesting the email of the user.
  const email = req.body.email;
  const findUser = await User.findOne({ email: email });
  if (!findUser) {
    //* Create a new user
    const newUser = await User.create(req.body);
    res.json(newUser);
  } else {
    //* User already exists
    throw new Error("User already exists");
  }
});

const loginUserCtrl = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //* req.body is the schema we put in postman.

  //* Now we need to check if a particular user esists.
  const findUser = await User.findOne({ email });
  if (findUser && (await findUser.isPasswordMatched(password))) {
    //* This is passing the password into userModel.js as enteredPassword.
    res.json({
      _id: findUser?._id,
      firstname: findUser?.firstname,
      lasname: findUser.lastname,
      email: findUser?.email,
      mobile: findUser?.mobile,
      token: generateToken(findUser?.id),
    });
  } else {
    throw new Error("Invalid credentials");
  }
});

//* Get all users

const getAllUser = asyncHandler(async (req, res) => {
  try {
    const getUsers = await User.find();
    res.json(getUsers);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = { createUser, loginUserCtrl };

const User = require('../models/userModel');
const asyncHandler = require("express-async-handler");
const createUser = asyncHandler(async (req, res) => {
    //* You cannot create a new user if they already exist. If you look at the user model then you can see the unique ID is for email, for this reason we are requesting the email of the user. 
    const email = req.body.email;
    const findUser = await User.findOne({ email:email });
    if (!findUser) {
        //* Create a new user
        const newUser = await User.create(req.body);
        res.json(newUser); 
    }

    else {
        //* User already exists
        throw new Error('User already exists');
    }
});

module.exports = { createUser };
const asyncHandler = require("express-async-handler");
const user = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
//@desc Register a user
//@route GET /api/users/register
//@access public
const registerUser =asyncHandler(async(req,res) => {
    const {username,email,password} = req.body;
    if(!username || !email || !password){
        res.status(400);
        throw new Error("All fields are mandatory");
    }
    const userAvailable = await user.findOne({email});
    if(userAvailable){
        res.status(400);
        throw new Error("User already registered");
    }
    //hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed Password: ", hashedPassword);
    const User = await user.create({
      username,
      email,
      password: hashedPassword,
    });
  
    console.log(`User created ${User}`);
    if (User) {
      res.status(201).json({ _id: User.id, email: User.email });
    } else {
      res.status(400);
      throw new Error("User data is not valid");
    }
    res.json({ message: "Register the user" });
  });
//@desc Login a user
//@route GET /api/users/register
//@access public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400);
      throw new Error("All fields are mandatory!");
    }
    const User = await user.findOne({ email });
    //compare password with hashedpassword
    if (User && (await bcrypt.compare(password, User.password))) {
      const accessToken = jwt.sign(
        {
          User: {
            username: User.username,
            email: User.email,
            id: User.id,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      );
      res.status(200).json({ accessToken });
    } else {
      res.status(401);
      throw new Error("email or password is not valid");
    }
  });
//@desc current user information
//@route GET /api/users/current
//@access private
const currentUser =asyncHandler(async(req,res) => {
    res.json(req.User);
});

module.exports = {registerUser,loginUser,currentUser};
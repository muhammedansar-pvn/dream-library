const user=require("../models/user")
const  jwt= require("jsonwebtoken")
const bcrypt = require ("bcrypt")


const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );
};


const regiter =(req,res)=>{
const {name,email,password,mobile,address,}= req.body;

const 


}  
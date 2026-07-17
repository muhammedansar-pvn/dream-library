const user = require("../models/user");
const Member= require ("../models/member")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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

const register = async (req, res, next) => {
    try {
        const { name, email, password, mobile, address } = req.body;
        
        const existinguser = await user.findOne({ email });
        if (existinguser) {
            return res.status(400).json({
                message: "user already exist"
            });
        }
        
        const hashedpassword = await bcrypt.hash(password, 10);
        
        const newUser = await user.create({
            name,
            email,
            password: hashedpassword,
            mobile,
            address
        });
        
        const accessToken = generateAccessToken(newUser);
        const refreshToken = generateRefreshToken(newUser);
        
        return res.status(200).json({
            message: "registration successfull",
            accessToken,
            refreshToken,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
            },
        });
    } catch (err) {
        next(err); 
    }
};


const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        
        const checkuser = await user.findOne({ email });
        if (!checkuser) {
            return res.status(400).json({
                message: "user not found"
            });
        }
        
        const passwordcheck = await bcrypt.compare(password, checkuser.password);
        if (!passwordcheck) {
            return res.status(400).json({
                
                message: "incorrect password" 
            });
        }
        
        const accessToken = generateAccessToken(checkuser);
        const refreshToken = generateRefreshToken(checkuser);
        
        return res.status(200).json({
            message: "login successfull",
            accessToken,
            refreshToken,
            user: {
                id: checkuser._id,
                name: checkuser.name,
                email: checkuser.email,
            },
        });
    } catch (err) {
       
        next(err); 
    }
};


const memberRegister = async (req,res,next)=>{
  try {
    const {name,email,mobile,address} = req.body;

    const existingMember = await member.findOne({email})
    if (existingMember){
      return res.status(400).json({ message:"Member already exist" })
    }

    const newMember = await member.create({ 
      name, email, mobile, address
    })
    
    const accessToken = generateAccessToken(newMember);
    const refreshToken = generateRefreshToken(newMember);

    return res.status(201).json({
      message:"Member registration successfull",
      accessToken,
      refreshToken,
      member: {
        id: newMember._id,
        name: newMember.name,
        email: newMember.email,
        membershipNumber: newMember.membershipNumber
      },
    })
  } catch (error) {
    res.status(500).json({message: error.message})
  }
}


const memberLogin = async (req,res,next)=>{
  try {
    const {membershipNumber} = req.body;
    
    const member = await Member.findOne({membershipNumber})
    if (!member){
      return res.status(404).json({ message:"Member not found" })
    }

   

    if(member.status !== 'Active'){
      return res.status(403).json ({ message:"Membership is Inactive" })
    }

    const accessToken = generateAccessToken(member);
    const refreshToken = generateRefreshToken(member);

    return res.status(200).json({
      message:"Member login successfull",
      accessToken,
      refreshToken,
      member: {
        id: member._id,
        name: member.name,
        email: member.email,
        membershipNumber: member.membershipNumber
      },
    })
  } catch (error) {
    res.status(500).json({message: error.message})
  }
}


module.exports = { register, login,memberRegister,memberLogin };

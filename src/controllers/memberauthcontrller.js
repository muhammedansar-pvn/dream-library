const Member = require("../models/member")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

const generateAccessToken = (member) => {
  return jwt.sign(
    { id: member._id, type: "member" },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

const generateRefreshToken = (member) => {
  return jwt.sign(
    { id: member._id, type: "member" },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );
};


const memberRegister = async (req,res)=>{
  try {
    const {name,email,password,mobile,address} = req.body;

    const existingMember = await Member.findOne({email})
    if (existingMember){
      return res.status(400).json({ message:"Member already exist" })
    }

    const newMember = await Member.create({ 
      name, email, password, mobile, address
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


const memberLogin = async (req,res)=>{
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

module.exports={memberRegister, memberLogin}
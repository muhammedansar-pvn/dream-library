const user = require("../models/user");
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

module.exports = { register, login };

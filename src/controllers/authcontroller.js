const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const generateTokens = (user) => ({
  accessToken: jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  ),
  refreshToken: jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  ),
});

const userRes = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  ...(user.membershipNumber && {
    membershipNumber: user.membershipNumber,
  }),
});

const register = async (req, res, next) => {
  try {
    const { name, email, password, mobile, address, role } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "An account with this email already exists",
      });
    }

    const newUser = await User.create({
      name,
      email,
      password: await bcrypt.hash(password, 10),
      mobile,
      address,
      role,
      ...(role === "member" && { status: "Active" }),
    });

    const { accessToken, refreshToken } = generateTokens(newUser);

    res.status(201).json({
      message: `${role.charAt(0).toUpperCase() + role.slice(1)} registration successful`,
      accessToken,
      refreshToken,
      user: userRes(newUser),
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, membershipNumber, password } = req.body;

    const user = membershipNumber
      ? await User.findOne({ membershipNumber })
      : await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "Account records do not exist",
      });
    }

    if (user.status !== "Active") {
      return res.status(403).json({
        message: "This account is inactive",
      });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return res.status(400).json({
        message: "Invalid password credentials provided",
      });
    }

    const { accessToken, refreshToken } = generateTokens(user);

    res.status(200).json({
      message: "Authentication successful",
      accessToken,
      refreshToken,
      user: userRes(user),
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
};


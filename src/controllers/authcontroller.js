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
  ...(user.membershipNumber && { membershipNumber: user.membershipNumber }),
});

const register = async (req, res, next) => {
  try {
    const { name, email, password, mobile, address, role } = req.body;

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    const userRole = ["admin", "member"].includes(role?.toLowerCase())
      ? role.toLowerCase()
      : "member";

    const emailvrf = email.toLowerCase();

    const existingUser = await User.findOne({ email: emailvrf });
    if (existingUser) {
      return res.status(400).json({ message: "An account with this email already exists" });
    }

    const userData = {
      name,
      email: emailvrf,
      mobile,
      address,
      role: userRole,
      password: await bcrypt.hash(password, 10),
      ...(userRole === "member" && { status: "Active" }),
    };

    const newUser = await User.create(userData);
    const { accessToken, refreshToken } = generateTokens(newUser);

    return res.status(201).json({
      message: `${userRole.charAt(0).toUpperCase() + userRole.slice(1)} registration successful`,
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
    const { email, password, membershipNumber } = req.body;

    if (!membershipNumber && !email) {
      return res.status(400).json({ message: "Please provide an email or a library card number" });
    }

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    const ogUser = membershipNumber
      ? await User.findOne({ membershipNumber: membershipNumber.toUpperCase() })
      : await User.findOne({ email: email.toLowerCase() });

    if (!ogUser) {
      return res.status(404).json({ message: "Account records do not exist" });
    }

    if (ogUser.status !== "Active") {
      return res.status(403).json({ message: "This account is inactive" });
    }

    const passwordMatches = await bcrypt.compare(password, ogUser.password);
    if (!passwordMatches) {
      return res.status(400).json({ message: "Invalid password credentials provided" });
    }

    const { accessToken, refreshToken } = generateTokens(ogUser);

    return res.status(200).json({
      message: "Authentication successful",
      accessToken,
      refreshToken,
      user: userRes(ogUser),
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login };
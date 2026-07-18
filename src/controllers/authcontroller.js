const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const SALT_ROUNDS = 10;

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

const buildUserResponse = (user) => ({
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

    const normalizedEmail = email.toLowerCase();

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ message: "An account with this email already exists" });
    }

    const userData = {
      name,
      email: normalizedEmail,
      mobile,
      address,
      role: userRole,
      password: await bcrypt.hash(password, SALT_ROUNDS),
      ...(userRole === "member" && { status: "Active" }),
    };

    const newUser = await User.create(userData);
    const { accessToken, refreshToken } = generateTokens(newUser);

    return res.status(201).json({
      message: `${userRole.charAt(0).toUpperCase() + userRole.slice(1)} registration successful`,
      accessToken,
      refreshToken,
      user: buildUserResponse(newUser),
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

    const targetUser = membershipNumber
      ? await User.findOne({ membershipNumber: membershipNumber.toUpperCase() })
      : await User.findOne({ email: email.toLowerCase() });

    if (!targetUser) {
      return res.status(404).json({ message: "Account records do not exist" });
    }

    if (targetUser.status !== "Active") {
      return res.status(403).json({ message: "Access denied. Account is currently marked inactive" });
    }

    const passwordMatches = await bcrypt.compare(password, targetUser.password);
    if (!passwordMatches) {
      return res.status(400).json({ message: "Invalid password credentials provided" });
    }

    const { accessToken, refreshToken } = generateTokens(targetUser);

    return res.status(200).json({
      message: "Authentication successful",
      accessToken,
      refreshToken,
      user: buildUserResponse(targetUser),
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login };
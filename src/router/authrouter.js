const express = require("express");
const router = express.Router();
const { protected } = require("../middleware/authMiddleware");
const { register, login } = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.get("/profile", protected, (req, res) => {
  res.status(200).json({ user: req.user });
});

module.exports = router;

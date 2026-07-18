const express = require("express");
const router = express.Router();
const { protected } = require("../middleware/authmiddleware");
const { register, login } = require("../controllers/authcontroller");

router.post("/register", register);
router.post("/login", login);
router.get("/profile", protected, (req, res) => {
  res.status(200).json({ user: req.user });
});





module.exports = router;
const express = require("express");
const router = express.Router();

const { protected } = require("../middleware/authmiddleware");
const validation = require("../middleware/validationmiddleware");

const { register, login } = require("../controllers/authcontroller");

const {registerSchema,loginSchema,} = require("../validation/authvalidation");

router.post("/register",validation(registerSchema),register);


router.post("/login",validation(loginSchema),login);

router.get("/profile",protected,(req, res) => {res.status(200).json({user: req.user,});});

module.exports = router;
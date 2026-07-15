const express = require("express");
const { memberRegister, memberLogin } = require("../controllers/memberauthcontrller");

const router = express.Router();

router.post("/register", memberRegister);
router.post("/login", memberLogin);

module.exports = router;
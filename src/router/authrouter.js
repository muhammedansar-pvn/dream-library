const express=require("express")

const protect = require("../middleware/authmiddleware")

const router=express.Router()


const {register,login, memberRegister, memberLogin} =require("../controllers/authcontroller")


router.post("/register",register)
router.post("/login",login)
router.get("/profile",protect)

router.post("/memberregister", memberRegister);
router.post("/memberlogin", memberLogin);


module.exports=router
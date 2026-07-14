const express=require("express")

const protect = require("../middleware/authmiddleware")

const router=express.Router()


const {register,login} =require("../controllers/authcontroller")


router.post("/register",register)
router.post("/login",login)
router.get("/profile",protect)

module.exports=router
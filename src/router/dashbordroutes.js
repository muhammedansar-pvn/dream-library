const express = require ("express")
const { protected, accsesRoles } = require("../middleware/authmiddleware")


const Router = express.Router()

const {dashbord} = require ("../controllers/dashbord")


Router.get("/", protected, accsesRoles("admin"), dashbord)


module.exports = Router
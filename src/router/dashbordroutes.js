const express = require ("express")
const { protected, accsesRoles } = require("../middleware/authmiddleware")


const Router = express.Router()

const {dashbord} = require ("../controllers/dashbord")

Router.get("/", protected, accsesRoles, dashbord)

module.exports = Router
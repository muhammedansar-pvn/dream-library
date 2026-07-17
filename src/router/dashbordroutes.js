const express = require ("express")

const Router = express.Router()

const {dashbord} = require ("../controllers/dashbord")

Router.get("/", dashbord)

module.exports = Router
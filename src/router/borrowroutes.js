const express = require ("express")
const { borrowBook } = require("../controllers/borrowcontrller")

const Router = express.Router()


Router.post ("/borrowbook", borrowBook )



module.exports=Router 
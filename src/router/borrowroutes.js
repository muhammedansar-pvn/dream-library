const express = require ("express")
const { borrowBook, returnBook } = require("../controllers/borrowcontrller")

const protect= require("../middleware/authmiddleware")

const Router = express.Router()


Router.post ("/borrowbook", borrowBook , protect )
Router.post ("/returnbook", returnBook, protect )



module.exports=Router 
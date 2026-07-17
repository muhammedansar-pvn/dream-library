const express = require ("express")
const { borrowBook, returnBook } = require("../controllers/borrowcontrller")


const Router = express.Router()


Router.post ("/borrowbook", borrowBook )
Router.post ("/returnbook", returnBook )



module.exports=Router 
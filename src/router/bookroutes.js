const express= require ("express")

const Router= express.Router()

//const protect = require("../middleware/authmiddleware")

const {addNewBook, getallbooks, getBookById, updateBookById, deleteBookById}=require("../controllers/bookcontroller")

Router.post("/addbook",addNewBook );
Router.put("/:id",updateBookById );
Router.delete("/:id",deleteBookById);

Router.get("/allbooks",getallbooks );


Router.get("/:id",getBookById );




module.exports= Router
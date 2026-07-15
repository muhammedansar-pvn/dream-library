const express= require ("express")

const Router= express.Router()

const {addNewBook}=require("../controllers/bookcontroller")

Router.post("/addbook",addNewBook );

module.exports= Router
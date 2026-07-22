const express = require("express");
const Router = express.Router();

const {
  borrowBook,
  returnBook,
  viewProfile,
  getallbooks,
  getBookById
} = require("../controllers/usercontroller")
const { protected } = require("../middleware/authmiddleware");
const validation = require("../middleware/validationmiddleware");

const {borrowBookSchema,returnBookSchema,} = require("../validation/borrowvalidation");
const {querySchema,idSchema}= require ("../validation/bookvalidation")

Router.get("/allbooks",validation(querySchema,),getallbooks);
Router.post("/borrowbook", protected,validation(borrowBookSchema),borrowBook);


Router.post("/returnbook",protected,validation(returnBookSchema),returnBook);

Router.get("/viewprofile", viewProfile)

Router.get("/:id",validation(idSchema, "params"),getBookById);


module.exports = Router;
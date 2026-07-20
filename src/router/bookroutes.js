const express = require("express");

const Router = express.Router();

const {
  getallbooks,
  getBookById,
  addNewBook,
  updateBookById,
  deleteBookById,
} = require("../controllers/bookcontroller");

const { protected, accsesRoles } = require("../middleware/authmiddleware");
const validation = require("../middleware/validationmiddleware");

const {
  createBookSchema,
  updateBookSchema,
  idSchema,
  querySchema,
} = require("../validation/bookvalidation");

Router.get("/",validation(querySchema, "query"),getallbooks);


Router.get("/:id",validation(idSchema, "params"),getBookById);

Router.post("/addbook",protected,accsesRoles("admin"),validation(createBookSchema),addNewBook);


Router.put("/:id",protected,accsesRoles("admin"),
validation(idSchema, "params"),
  validation(updateBookSchema),
  updateBookById);

Router.delete("/:id",protected,
  accsesRoles("admin"),
  validation(idSchema, "params"),
  deleteBookById);

module.exports = Router;
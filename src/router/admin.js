const express = require("express");

const Router = express.Router();

const {
  getallbooks,
  getBookById,
  getallusers,
  addNewBook,
  updateBookById,
  deleteBookById,
} = require("../controllers/adminbookcontroller");

const { protected, accsesRoles } = require("../middleware/authmiddleware");
const validation = require("../middleware/validationmiddleware");

const {
  createBookSchema,
  updateBookSchema,
  idSchema,
} = require("../validation/bookvalidation");

Router.post("/addbook",protected,accsesRoles("admin"),validation(createBookSchema),addNewBook);
Router.get("/allusers", protected,accsesRoles("admin") , getallusers)
Router.get("/allbooks", protected,accsesRoles("admin") , getallbooks)


Router.put("/:id",
  protected,accsesRoles("admin"),
  validation(idSchema, "params"),
  validation(updateBookSchema),
  updateBookById);

Router.delete("/:id",protected,
  accsesRoles("admin"),
  validation(idSchema, "params"),
  deleteBookById);

  Router.get("/:id",validation(idSchema, "params"),getBookById);

module.exports = Router;
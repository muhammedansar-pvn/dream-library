const express = require("express")

const Router = express.Router()

const { getallbooks, getBookById , addNewBook, updateBookById, deleteBookById } = require("../controllers/bookcontroller")
const { protected, accsesRoles } = require("../middleware/authmiddleware")


Router.get("/", getallbooks);
Router.get("/:id", getBookById);


Router.post("/addbook", protected, accsesRoles("admin"), addNewBook);
Router.put("/:id", protected, accsesRoles("admin"), updateBookById);
Router.delete("/:id", protected,accsesRoles("admin"), deleteBookById);

module.exports = Router
const express = require("express")

const Router = express.Router()

const { getallbooks, getBookById , addNewBook, updateBookById, deleteBookById } = require("../controllers/bookcontroller")
const { protected, authorizeRoles } = require("../middleware/authmiddleware")


Router.get("/allbooks", getallbooks);
Router.get("/:id", getBookById);


Router.post("/addbook", protected, authorizeRoles("admin"), addNewBook);
Router.put("/:id", protected, authorizeRoles("admin"), updateBookById);
Router.delete("/:id", protected, authorizeRoles("admin"), deleteBookById);

module.exports = Router
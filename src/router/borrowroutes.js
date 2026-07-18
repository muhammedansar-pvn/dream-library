const express = require("express");
const { borrowBook, returnBook } = require("../controllers/borrowcontrller");
const {protected} = require("../middleware/authmiddleware");

const Router = express.Router();

Router.post("/borrowbook", protected, borrowBook);
Router.post("/returnbook", protected, returnBook);

module.exports = Router;
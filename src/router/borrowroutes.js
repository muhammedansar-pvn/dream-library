const express = require("express");
const Router = express.Router();

const {
  borrowBook,
  returnBook,
} = require("../controllers/borrowcontrller");

const { protected } = require("../middleware/authmiddleware");
const validation = require("../middleware/validationmiddleware");

const {
  borrowBookSchema,
  returnBookSchema,
} = require("../validation/borrowvalidation");


Router.post(
  "/borrowbook",
  protected,
  validation(borrowBookSchema),borrowBook);


Router.post(
  "/returnbook",
  protected,
  validation(returnBookSchema),
  returnBook
);

module.exports = Router;
const Joi = require("joi");

const borrowBookSchema = Joi.object({
  membershipNumber: Joi.string()
    .trim()
    .uppercase()
    .required(),

  isbn: Joi.string()
    .trim()
    .required(),
});

const returnBookSchema = Joi.object({
  membershipNumber: Joi.string()
    .trim()
    .uppercase()
    .required(),

  isbn: Joi.string()
    .trim()
    .required(),
});

module.exports = {
  borrowBookSchema,
  returnBookSchema,
};
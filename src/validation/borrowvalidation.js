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

const viewprofile= Joi.object({
  membershipNumber: Joi.string()
    .trim()
    .uppercase()
    .required(),
})

module.exports = {
  viewprofile,
  borrowBookSchema,
  returnBookSchema,
};
const Joi = require("joi");

const createBookSchema = Joi.object({
  title: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required(),

  author: Joi.string()
    .trim()
    .required(),

  category: Joi.string()
    .trim()
    .required(),

  publishedyear: Joi.number()
    .integer()
    .min(1000)
    .max(new Date().getFullYear())
    .required(),

  totalcopies: Joi.number()
    .integer()
    .min(1)
    .required(),

  isbn: Joi.string()
    .trim()
    .required(),
});

const updateBookSchema = Joi.object({
  title: Joi.string().trim().min(2).max(100),

  author: Joi.string().trim(),

  category: Joi.string().trim(),

  publishedyear: Joi.number()
    .integer()
    .min(1000)
    .max(new Date().getFullYear()),

  totalcopies: Joi.number()
    .integer()
    .min(1),

  isbn: Joi.string().trim(),
}).min(1);

const idSchema = Joi.object({
  id: Joi.string()
    .hex()
    .length(24)
    .required(),
});

const querySchema = Joi.object({
  category: Joi.string().trim(),

  search: Joi.string().trim(),
});

module.exports = {
  createBookSchema,
  updateBookSchema,
  idSchema,
  querySchema,
};
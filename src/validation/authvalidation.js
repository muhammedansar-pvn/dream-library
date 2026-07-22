    const Joi = require("joi");

const registerSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(3)
    .max(50)
    .required(),

  email: Joi.string()
    .trim()
    .lowercase()
    .email()
    .required(),

  password: Joi.string()
    .min(6)
    .max(30)
    .required(),

  mobile: Joi.string()
    .trim()
    .pattern(/^[0-9]{10}$/)
    .optional(),

  address: Joi.string()
    .trim()
    .max(200)
    .optional(),

  role: Joi.string()
    .lowercase()
    .valid("admin", "member")
    .default("member"),
});

const loginSchema = Joi.object({
  email: Joi.string()
    .trim()
    .lowercase()
    .email(),

  membershipNumber: Joi.string()
    .trim()
    .uppercase(),

  password: Joi.string()
    .required(),

}).or("email", "membershipNumber");

module.exports = {
  registerSchema,
  loginSchema,
};
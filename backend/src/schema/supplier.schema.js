const Joi = require("joi");

const supplierSchema = Joi.object({
  name: Joi.string().required(),
  address: Joi.string().required(),
  phone: Joi.string().required(),
});

module.exports = supplierSchema;

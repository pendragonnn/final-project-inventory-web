const Joi = require('joi')

const supplierSchema = Joi.object({
  supplier: Joi.string().required(),
  address: Joi.string().required(),
  phone: Joi.string().required(),
})

module.exports = supplierSchema
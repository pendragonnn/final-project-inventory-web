const Joi = require('joi')

const outletSchema = Joi.object({
  outlet_name: Joi.string().required(),
  address: Joi.string().required(),
  phone: Joi.string().required(),
})

module.exports = outletSchema
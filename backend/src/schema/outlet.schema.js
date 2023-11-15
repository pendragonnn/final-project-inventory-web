const Joi = require('joi')

const outletSchema = Joi.object({
  name: Joi.string().required(),
  address: Joi.string().required(),
  phone: Joi.string().required(),
})

module.exports = outletSchema
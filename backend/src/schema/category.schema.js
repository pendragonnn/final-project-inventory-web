const Joi = require('joi')

const categorySchema = Joi.object({
  name: Joi.string().required(),
  address: Joi.string().required(),
})

module.exports = categorySchema
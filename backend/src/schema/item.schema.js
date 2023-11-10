const Joi = require('joi')

const itemSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  category_id: Joi.string().required(),
  price: Joi.number().required(),
  stock: Joi.number().required(),
})

module.exports = itemSchema
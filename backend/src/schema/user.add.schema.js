const Joi = require('joi')

const userAddSchema = Joi.object({
  role_id: Joi.number().required(),
  full_name: Joi.string().required(),
  email: Joi.string().email(),
  password: Joi.string().required(),
  image_url: Joi.string()
})

module.exports = userAddSchema
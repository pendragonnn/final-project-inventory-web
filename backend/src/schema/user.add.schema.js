const Joi = require('joi')

const userAddSchema = Joi.object({
  role_id: Joi.string().required(),
  full_name: Joi.string().required(),
  username: Joi.string().required(),
  password: Joi.string().required(),
})

module.exports = userAddSchema
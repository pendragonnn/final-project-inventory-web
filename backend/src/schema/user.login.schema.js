const Joi = require('joi')

const userLoginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required()
})

module.exports = userLoginSchema
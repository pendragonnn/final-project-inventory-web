const Joi = require('joi')

const transactionHeaderSchema = Joi.object({
  user_id: Joi.string().required(),
  outlet_id: Joi.string(),
  supplier_id: Joi.string(),
  information: Joi.number().required(),
  transaction_date: Joi.date().required(),
  total_amount: Joi.number().required(),
})

module.exports = transactionHeaderSchema
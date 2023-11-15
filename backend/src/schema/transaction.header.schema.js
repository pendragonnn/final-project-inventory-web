const Joi = require("joi")

const transactionHeaderSchema = Joi.object({
  user_id: Joi.string().required(),
  outlet_id: Joi.string().allow(null).optional(),
  supplier_id: Joi.string().allow(null).optional(),
  item_id: Joi.string().required(),
  quantity: Joi.number().required(),
  unit_price: Joi.number().required(),
  information: Joi.string().required(),
  transaction_date: Joi.date().required(),
  total_amount: Joi.number().optional(),
})

module.exports = transactionHeaderSchema

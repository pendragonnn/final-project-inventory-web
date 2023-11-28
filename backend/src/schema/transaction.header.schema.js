const Joi = require("joi")

const transactionHeaderSchema = Joi.object({
  user_id: Joi.string().required(),
  outlet_id: Joi.string().allow(null).optional(),
  supplier_id: Joi.string().allow(null).optional(),
  information: Joi.string().required(),
  transaction_date: Joi.date().required(),
  Detail: Joi.array().optional(),
})

module.exports = transactionHeaderSchema

const Joi = require("joi")

const transactionDetailSchema = Joi.object({
  // header_id: Joi.string().required(),
  // item_id: Joi.string().required(),
  // quantity: Joi.number().required(),
})

module.exports = transactionDetailSchema

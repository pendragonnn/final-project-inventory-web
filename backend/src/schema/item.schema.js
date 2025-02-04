const Joi = require("joi");

const itemSchema = Joi.object({
	description: Joi.string().required(),
	price: Joi.number().required(),
	size: Joi.number().required(),
	stock: Joi.number().required(),
	brand_id: Joi.string(),
});

module.exports = itemSchema;

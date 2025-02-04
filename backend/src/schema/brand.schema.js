const Joi = require("joi");

const brandSchema = Joi.object({
	name: Joi.string().required(),
	type: Joi.string().required(),
	category_id: Joi.string().required(),
	image_url: Joi.string(),
});

module.exports = brandSchema;

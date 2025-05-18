"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Brand extends Model {
		static associate(models) {
			Brand.hasMany(models.Item, {
				foreignKey: "brand_id",
			});
			Brand.belongsTo(models.Category, {
				foreignKey: "category_id",
			});
		}
	}
	Brand.init(
		{
			name: DataTypes.STRING,
			type: DataTypes.STRING,
			category_id: DataTypes.STRING,
			image_url: DataTypes.STRING,
		},

		{
			sequelize,
			modelName: "Brand",
		}
	);
	return Brand;
};

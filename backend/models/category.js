"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Category extends Model {
		static associate(models) {
			Category.hasMany(models.Brand, {
				foreignKey: "category_id",
			});
		}
	}
	Category.init(
		{
			name: DataTypes.STRING,
		},
		{
			sequelize,
			modelName: "Category",
		}
	);
	return Category;
};

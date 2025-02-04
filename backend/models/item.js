"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Item extends Model {
		static associate(models) {
			Item.belongsTo(models.Brand, {
				foreignKey: "brand_id",
			});
			Item.hasMany(models.TransactionDetail, {
				foreignKey: "header_id",
			});
		}
	}
	Item.init(
		{
			description: DataTypes.STRING,
			price: DataTypes.INTEGER,
			size: DataTypes.INTEGER,
			stock: DataTypes.INTEGER,
			brand_id: DataTypes.STRING,
		},
		{
			sequelize,
			modelName: "Item",
		}
	);
	return Item;
};

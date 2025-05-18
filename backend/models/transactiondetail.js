"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class TransactionDetail extends Model {
		static associate(models) {
			TransactionDetail.belongsTo(models.TransactionHeader, {
				foreignKey: "header_id",
			});
			TransactionDetail.belongsTo(models.Item, {
				foreignKey: "item_id",
			});
		}
	}
	TransactionDetail.init(
		{
			header_id: DataTypes.STRING,
			item_id: DataTypes.STRING,
			quantity: DataTypes.INTEGER,
			price_item: DataTypes.INTEGER,
			stock_before: DataTypes.INTEGER,
			stock_after: DataTypes.INTEGER,
			reason: DataTypes.STRING,
		},
		{
			sequelize,
			modelName: "TransactionDetail",
		}
	);
	return TransactionDetail;
};

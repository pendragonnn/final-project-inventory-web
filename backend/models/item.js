"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class Item extends Model {
    static associate(models) {
      Item.belongsTo(models.Category, {
        foreignKey: "category_id",
      })
      Item.hasMany(models.TransactionDetail, {
        foreignKey: "header_id",
      })
    }
  }
  Item.init(
    {
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      category_id: DataTypes.STRING,
      price: DataTypes.INTEGER,
      stock: DataTypes.INTEGER,
      image_url: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Item",
    }
  )
  return Item
}

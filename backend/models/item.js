"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class Item extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Item.belongsTo(models.Category, {
        foreignKey: "category_id",
      })
      Item.hasMany(models.TransactionDetail, {
        foreignKey: "item_id",
      })
    }
  }
  Item.init(
    {
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      category_id: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      price: DataTypes.INTEGER,
      stock: DataTypes.INTEGER,
      image_url: DataTypes.STRING,
      supplier_id: DataTypes.STRING,
      deletedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Item",
      paranoid: true,
      timestamps: true,
    }
  )
  return Item
}

"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class TransactionHeader extends Model {
    static associate(models) {
      TransactionHeader.belongsTo(models.Supplier, {
        foreignKey: "supplier_id",
      })
      TransactionHeader.belongsTo(models.User, {
        foreignKey: "user_id",
      })
      TransactionHeader.belongsTo(models.Outlet, {
        foreignKey: "outlet_id",
      })
      TransactionHeader.hasMany(models.TransactionDetail, {
        foreignKey: "header_id",
      })
    }
  }
  TransactionHeader.init(
    {
      user_id: DataTypes.STRING,
      outlet_id: DataTypes.STRING,
      supplier_id: DataTypes.STRING,
      information: DataTypes.STRING,
      transaction_date: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "TransactionHeader",
    }
  )
  return TransactionHeader
}

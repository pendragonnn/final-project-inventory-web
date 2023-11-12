'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TransactionDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      TransactionDetail.belongsTo(models.TransactionHeader, {
        foreignKey: 'header_id'
      })
      TransactionDetail.belongsTo(models.Item, {
        foreignKey: 'item_id'
      })
    }
  }
  TransactionDetail.init({
    header_id: DataTypes.STRING,
    item_id: DataTypes.STRING,
    quantity: DataTypes.INTEGER,
    unit_price: DataTypes.INTEGER,
    total_price: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'TransactionDetail',
  });
  return TransactionDetail;
};
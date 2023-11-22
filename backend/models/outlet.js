'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Outlet extends Model {
    static associate(models) {
      Outlet.hasMany(models.TransactionHeader, {
        foreignKey: 'outlet_id'
      })
    }
  }
  Outlet.init({
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    phone: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Outlet',
  });
  return Outlet;
};
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.belongsTo(models.Role, {
        foreignKey: 'role_id'
      })
      User.hasMany(models.TransactionHeader, {
        foreignKey: 'user_id'
      })
    }
  }
  User.init({
    role_id: DataTypes.STRING,
    full_name: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    image_url: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
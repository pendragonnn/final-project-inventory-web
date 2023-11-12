'use strict';
const {
  Model,
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Item extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Item.belongsTo(models.Category, {
        foreignKey: 'category_id',
       
      })
      Item.hasMany(models.TransactionDetail, {
<<<<<<< HEAD
        foreignKey: 'item_id'  //hasMany
=======
        foreignKey: 'item_id'
>>>>>>> 3413891fc6e1c31f0e6ec744cee1f54190acb65c
      })
    }
  }
  Item.init({
   
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    category_id: {
     type: DataTypes.STRING,
     allowNull:true
    },
    price: DataTypes.INTEGER,
    stock: DataTypes.INTEGER,
    image_url: DataTypes.STRING,
<<<<<<< HEAD
    supplier_id: DataTypes.INTEGER,
    deletedAt:DataTypes.DATE
=======
>>>>>>> 3413891fc6e1c31f0e6ec744cee1f54190acb65c
  }, {
    sequelize,
    modelName: 'Item',
    paranoid: true, 
    timestamps: true
  });
  return Item;
};
const { Utils } = require("sequelize");
const models = require("../models");
const handleItem = require("../utils/itemUtils")
const Item = models.Item;

const itemRepository = {
  getAllItems: async function () {
    try {
      return await Item.findAndCountAll();
    } catch (error) {
      throw new Error(error.message);
    }
  },
  getDetailItems: async function (id) {
    try {
      return await Item.findByPk(id);
    } catch (error) {
      throw new Error(error.message);
    }
  },

  createItems: async function (
    name,
    description,
    category_id,
    price,
    stock,
    image_url,
    supplier_id
  ) {
    try {
      // Pindahkan definisi existingIds di luar fungsi generateNewId
      const existingIds = await Item.findAll({ attributes: ["id"] });

      const newId = handleItem.generateNewId(existingIds);

      console.log(newId);

      // Pastikan newId tidak null sebelum mencoba membuat item
      if (!newId) {
        throw new Error("Failed to generate a valid ID");
      }

      if (typeof category_id !== "string") {
        throw new Error("Invalid value for 'category_id'");
      }

      const newItem = await Item.create({
        id: newId,
        name,
        description,
        category_id,
        price,
        stock,
        image_url,
        supplier_id,
      });

      return newItem;
    } catch (error) {
      throw new Error(error.message);
    }
  },


  updateItems: async function (
  
    name,
    description,
    category_id,
    price,
    stock,
    image_url,
    supplier_id
  ) {
    try {
      const updatedItem = await Item.update(
        {
          name,
          description,
          category_id,
          price,
          stock,
          image_url,
          supplier_id,
        },
        { where: { id: id } }
      );

      return updatedItem;
    } catch (error) {
      throw new Error(error.message);
    }
  },
  softDeleteItem: async function (id) {
    try {
      const [rowsAffected, deletedItem] = await Item.update(
        { deletedAt: new Date() },
        { where: { id: id }, returning: true }
      );

      if (rowsAffected === 0) {
        throw new Error("Item not fount");
      }

      return deletedItem[0];
    } catch (error) {
      console.log(error);
      throw new Error(error.message);
    }
  },
};

module.exports = itemRepository;

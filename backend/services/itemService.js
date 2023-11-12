const itemRepository = require("../repositories/itemsRepository");

const itemService = {
  validateCategory: function (category_id) {
    if (typeof category_id !== "string") {
      throw new Error("Invalid value for 'category_id'");
    }
  },

  getAllItems: async function (page) {
    try {
      return await itemRepository.getAllItems(page);
    } catch (error) {

      throw new Error("Failed to get items: " + error.message);
    }
  },

  getDetailItems: async function (id) {
    try {
      return await itemRepository.getDetailItems(id);
    } catch (error) {
      throw new Error("Failed to get item details: " + error.message);
    }
  },

  createItems: async function (name, description, category_id, price, stock, image_url, supplier_id) {
    try {
      this.validateCategory(category_id);

      

      return await itemRepository.createItems(name, description, category_id, price, stock, image_url, supplier_id);
    } catch (error) {
      throw new Error("Failed to create item: " + error.message);
    }
  },

  updateItems: async function (id, name, description, category_id, price, stock, image_url, supplier_id) {
    try {
      this.validateCategory(category_id);

      return await itemRepository.updateItems(id, name, description, category_id, price, stock, image_url, supplier_id);
    } catch (error) {
      throw new Error("Failed to update item: " + error.message);
    }
  },

  softDeleteItems: async function (id) {
    try {
      return await itemRepository.softDeleteItem(id);
    } catch (error) {
      throw new Error("Failed to soft delete item: " + error.message);
    }
  },
};

module.exports = itemService;

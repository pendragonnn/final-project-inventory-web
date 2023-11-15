const itemRepository = require("../repository/itemsRepository")

const itemService = {
  // validateCategory: function (category_id) {
  //   if (typeof category_id !== "string") {
  //     throw new Error("Invalid value for 'category_id'")
  //   }
    

  // },
  validatorImageUrl: function (){
    if (typeof image_url !== "string") {
      throw new Error("Invalid value for 'image_url'")
    }
  },

  getAllItems: async function () {
    try {
      return await itemRepository.getAllItems()
    } catch (error) {
      throw new Error("Failed to get items: " + error.message)
    }
  },

  getDetailItems: async function (id) {
    try {
      return await itemRepository.getDetailItems(id)
    } catch (error) {
      throw new Error("Failed to get item details: " + error.message)
    }
  },

  createItems: async function (
    name,
    description,
    category_id,
    price,
    stock,
    image_url,
  
  ) {
    try {
      this.validateCategory(category_id)

      return await itemRepository.createItems(
        name,
        description,
        category_id,
        price,
        stock,
        image_url,
      
      )
    } catch (error) {
      throw new Error("Failed to create item: " + error.message)
    }
  },
  updateItems: async function (id, name, description, category_id, price, stock, image_url) {
    try {
      this.validateCategory(category_id);

      return await itemRepository.updateItems(id, name, description, category_id, price, stock, image_url);
    } catch (error) {
      throw new Error("Failed to update item: " + error.message);
    }
  },

 

}

module.exports = itemService

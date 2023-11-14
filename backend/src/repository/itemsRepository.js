const { Utils } = require("sequelize")
const models = require("../../models")
const handleItem = require("../util/itemUtils")
const Item = models.Item

const itemRepository = { 
  getAllItems: async function () {
  
    try {
      return await Item.findAll()
      
    } catch (error) {
      throw new Error(error.message)
    }
  },
  getDetailItems: async function (id) {
    try {
      return await Item.findByPk(id)
    } catch (error) {
      throw new Error(error.message)
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
    
      const existingIds = await Item.findAll({ attributes: ["id"] })

      const newId = handleItem.generateNewId(existingIds)

      console.log(newId)

      if (!newId) {
        throw new Error("Failed to generate a valid ID")
      }


      const newItem = await Item.create({
        id: newId,
        name,
        description,
        category_id,
        price,
        stock,
        image_url,
      });

      return newItem
    } catch (error) {
      throw new Error(error.message)
    }
  },

  updateItems: async function (
    id,
    name,
    description,
    category_id,
    price,
    stock,
    image_url,
  
  ) {
    try {
      this.validateCategory(category_id)

      return await itemRepository.updateItems(
        id,
        name,
        description,
        category_id,
        price,
        stock,
        image_url,
    
      )
    } catch (error) {
      throw new Error("Failed to update item: " + error.message)
    }
  },

  
  deleteItem: async function (id) {
    try {
      const itemToDelete = await Item.findByPk(id);

      if (!itemToDelete) {
        throw new Error("Item not found");
      }

      await itemToDelete.destroy();

      return { message: "Item deleted successfully" };
    } catch (error) {
      throw new Error("Failed to delete item: " + error.message);
    }
  },

 
  
   
 
  

}

module.exports = itemRepository

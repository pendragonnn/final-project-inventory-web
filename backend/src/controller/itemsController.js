const itemService = require("../service/itemService")
const repository = require("../repository/itemsRepository")

const itemsController = {
  getAllItems: async function (req, res) {
    const page = req.query.page || 1
    try {
      const items = await itemService.getAllItems(page)
      if (items === null) return res.send("data is empty")

      res.status(200).json({
        items: items,
        totalItems: items.count,
        currentPage: page,
        totalPages: Math.ceil(items.count / 10),
        message: "success",
      })
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: error })
    }
  },

  getDetailsItems: async function (req, res) {
    const id = req.params.id
    console.log(id)
    try {
      const items = await repository.getDetailItems(id)
      if (!items) return res.status(404).json({ massage: "not found" })

      res.status(200).json({
        data: items,
        massage: "success",
      })
    } catch (error) {
      res.status(500).json({ massage: "get details data fail" })
    }
  },
  createItems: async function (req, res) {
    const { name, description, category_id, price, stock,  image_url} =
      req.body
    try {
      const newItem = await repository.createItems(
        name,
        description,
        category_id,
        price,
        stock,
        image_url,
     
      )

      res.status(201).json({
        data: newItem,
        message: "create data items success",
      })
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: "create data item fail" })
    }
  },
  updateItem: async function (req, res) {
    const id = req.params.id;
    const updatedData = req.body;

    try {
      const updatedItem = await repository.updateItem(id, updatedData);

      res.status(200).json({
        data: updatedItem,
        message: 'Update data item success',
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Update data item fail' });
    }
  },
  deleteItem: async function (req, res) {
    const id = req.params.id;

    try {
      const result = await itemService.deleteItem(id);

      res.status(200).json({
        message: result.message,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Failed to delete item" });
    }
  },
  uploadImage: async function (req, res) {
    const file = req.file;
    try {
      if (!file) {
        return res.status(400).send({
          status: false,
          message: "No file is selected",
        });
      }
  
      const image_url = `/upload/${file.filename}`;
      const { name, description, category_id, price, stock, } =
        req.body;
  

      const newItem = await repository.createItems(
        name,
        description,
        category_id, 
        price,
        stock,
        image_url
      );
  
      if (!newItem) {
        return res.status(404).json({ message: "Item not found" });
      }
  
      await newItem.save();
      res.json({ message: "Upload image success" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Upload image fail" });
    }
  },

}

module.exports = itemsController

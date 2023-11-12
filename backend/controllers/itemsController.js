const itemService = require("../services/itemService");
const repository = require("../repositories/itemsRepository");

const itemsController = {


    getAllItems: async function (req, res) {
      const page = req.query.page || 1;
      try {
        const items = await itemService.getAllItems(page);
        if (items === null) return res.send("data is empty");
  
        res.status(200).json({
          items: items.rows,
          totalItems: items.count,
          currentPage: page,
          totalPages: Math.ceil(items.count / 10),
          message: "success",
        });
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: "get data failed" });
      }
    },
  
  
  
  getDetailsItems: async function (req, res) {
    const id = req.params.id;
    console.log(id);
    try {
      const items = await repository.getDetailItems(id);
      if (!items) return res.status(404).json({ massage: "not found" });

      res.status(200).json({
        data: items,
        massage: "success",
      });
    } catch (error) {
      res.status(500).json({ massage: "get details data fail" });
    }
  },
  createItems: async function(req, res){
    const { name, description, category_id, price, stock, supplier_id } = req.body;
    try {
      
      const newItem = await repository.createItems(
        name,
        description,
        category_id,
        price,
        stock,
        imageUrl,
        supplier_id
      );
  
      res.status(201).json({
        data: newItem,
        message: 'create data items success'
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'create data item fail' });
    }
  },
  
  updateItems: async function(req, res){
    const id = req.params.id;
    const { name, description, category_id, price, stock, supplier_id } = req.body;
    const image_url = req.body.image_url
  
    try {
      await repository.updateItems(id, name, description, category_id, price, stock, image_url, supplier_id); 
      res.status(200).json({ massage: 'update items success' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ massage: "update data fail" });
    }
  },
  softDeleteItems: async function (req, res) {
    const id = req.params.id;
  
    try {
      const deletedItem = await repository.softDeleteItem(id);
      res.status(200).json({ message: 'Soft delete item berhasil', data: deletedItem });
    } catch (error) {
      console.log(error);
      res.status(404).json({ message: 'Soft delete data gagal' });
    }
  },

  uploadImage: async function(req, res){
    const file = req.file;
    try {
      if (!file) {
        return res.status(400).send({
          status: false,
          message: 'No file is selected',
        });
      }
   
      const urlImage = `../upload/${file.filename}`;
      const { name, description, category_id, price, stock, supplier_id } = req.body;
      
      // Lakukan validasi atau pemeriksaan apakah category_id sesuai dengan yang diinginkan
     
      const items = await repository.createItems(
        name,
        description,
        category_id,
        price,
        stock,
        urlImage,
        supplier_id
      );
   
      if (!items) {
        return res.status(404).json({ message: 'Film not found' });
      }
   
      await items.save();
      res.json({ message: 'Upload image success' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Upload image fail' });
    }
  }
  
  
};

module.exports = itemsController;

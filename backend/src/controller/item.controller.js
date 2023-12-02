const { log } = require("console");
const {
  getAllItems,
  getItemById,
  insertItem,
  editItemById,
  deleteItemById,
  updateItemPhoto,
} = require("../service/item.service");

const allItems = async (req, res) => {
  const page = req.query.page || 1;
  const size = req.query.size || 10;
  try {
    const { items, dataLength } = await getAllItems(page, size);
    res.status(200).json({
      data: items,
      totalItems: dataLength,
      currentPage: parseInt(page),
      totalPages: Math.ceil(dataLength / size),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const itemById = async (req, res) => {
  try {
    const itemId = req.params.id;
    const item = await getItemById(itemId);

    if (!item) {
      return res.status(404).json({ message: "Item Not Found" });
    }

    res.status(200).json({ data: item });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const postItem = async (req, res) => {
  try {
    const newItemData = req.body;

    const item = await insertItem(newItemData);

    res.json({
      data: item,
      message: "Successful Adding Item",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateItem = async (req, res) => {
  const itemId = req.params.id;
  const itemData = req.body;

  if (!itemData) {
    return res.status(400).send("Data Must Have Value");
  }

  try {
    const item = await editItemById(itemId, itemData);
    if (!item) {
      return res.status(400).json({ Error: "Item Not Found or Already Added" });
    }

    res.status(200).json({
      data: item,
      message: "Successfull Update Item!",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const removeItem = async (req, res) => {
  try {
    const itemId = req.params.id;

    await deleteItemById(itemId);
    res.status(200).json({ message: "Successful Delete Item!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const uploadItemPhoto = async (req, res) => {
  console.log("tesssss");
 
  try {
    const id = req.params.id;
    const item = await getItemById(id);
    console.log("Request Body:", req.body);
    console.log("Request File:", req.file);

    // Penahan tempat: Implementasikan logika untuk mengambil item berdasarkan ID dari database


    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const image_url = req.file.filename;
    
    console.log(image_url);

    // Penahan tempat: Implementasikan logika untuk memperbarui foto item di database
    const updatedItem = await updateItemPhoto(id, image_url);

    res.status(200).json({ message: "Item photo updated successfully", data: updatedItem });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  allItems,
  itemById,
  postItem,
  updateItem,
  removeItem,
  uploadItemPhoto,
};

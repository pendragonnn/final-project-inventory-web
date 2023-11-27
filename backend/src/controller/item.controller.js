const {
  getAllItems,
  getItemById,
  insertItem,
  editItemById,
  deleteItemById,
  updateItemPhoto,
} = require("../service/item.service");
const fs = require("fs");

const allItems = async (req, res) => {
  const page = req.query.page || 1;
  const size = req.query.size || 100;
  try {
    const { items, dataLength } = await getAllItems(page, size);
    res.status(200).json({
      data: items,
      totalItems: items.length,
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
  try {
    const id = req.params.id;
    const item = await getItemById(id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const image_url = req.file.path;

    const updatedUser = await updateItemPhoto(id, image_url);

    res
      .status(200)
      .json({ message: "User photo updated successfully", data: updatedUser });
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

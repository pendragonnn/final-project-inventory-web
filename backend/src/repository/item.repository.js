const models = require("../../models");
const Item = models.Item;
const Category = models.Category;

const findItems = async (page, size) => {
  const offset = (page - 1) * size;
  const ItemsAll = await Item.findAll({
    include: [
      {
        model: Category,
      },
    ],
  });
  const dataLength = ItemsAll.length;
  const items = await Item.findAll({
    include: [
      {
        model: Category,
      },
    ],
    offset: offset,
    limit: size,
    order: [["id", "DESC"]],
    order: [["id", "DESC"]],
  });
  return { items, dataLength };
};

const findItemById = async (id) => {
  const item = await Item.findOne({
    where: {
      id,
    },

    include: [
      {
        model: Category,
      },
    ],
  });

  return item;
};

const findItemByName = async (name) => {
  const item = await Item.findOne({
    where: {
      name,
    },
  });
  return item;
};

function generateNewId(existingIds) {
  const maxNumber = existingIds.reduce((max, item) => {
    const currentNumber = parseInt(item.id.split("-")[1], 10);
    return currentNumber > max ? currentNumber : max;
  }, 0);

  const newNumber = maxNumber + 1;
  const newId = `I-${String(newNumber).padStart(4, "0")}`;

  return newId;
}

const createItem = async (itemData) => {
  const existingIds = await Item.findAll({ attributes: ["id"] });
  const newId = generateNewId(existingIds);

  const item = await Item.create({
    id: newId,
    name: itemData.name,
    description: itemData.description,
    category_id: itemData.category_id,
    price: itemData.price,
    stock: itemData.stock,
    image_url: itemData.image_url,
  });

  return item;
};

const editItem = async (id, updatedFields) => {
  const { name, description, category_id, stock, price, image_url } =
    updatedFields;
  const item = await Item.findByPk(id);

  if (!item) {
    throw new Error("Item not found");
  }

  const updatedData = {};

  if (name !== undefined && name !== item.name) {
    updatedData.name = name;
  }

  if (description !== undefined) {
    updatedData.description = description;
  }
  if (category_id !== undefined) {
    updatedData.category_id = category_id;
  }
  if (stock !== undefined) {
    updatedData.stock = stock;
  }
  if (price !== undefined) {
    updatedData.price = price;
  }
  if (image_url !== undefined) {
    updatedData.image_url = image_url;
  }

  if (Object.keys(updatedData).length === 0) {
    // Tidak ada perubahan yang perlu diperbarui
    return item; // Mengembalikan data outlet tanpa melakukan update
  }

  const updatedItems = await Item.update(updatedData, {
    where: {
      id: id,
    },
    returning: true,
  });

  return updatedItems[1][0];
};

const deleteItem = async (id) => {
  const item = await Item.destroy({
    where: {
      id,
    },
  });

  return item;
};

const updateItemPhotos = async (id, image_url) => {
  try {
    const updatedItem = await Item.update(
      { image_url: image_url },
      { where: { id }, returning: true }
    );

    if (updatedItem[0] === 0) return null;

    return updatedItem[1][0].dataValues;
  } catch (error) {
    throw error;
  }
};

const updateStock = async (id, stock) => {
  try {
    const updatedItem = await Item.update(
      { stock: stock },
      { where: { id }, returning: true }
    );

    if (updatedItem[0] === 0) return null;

    return updatedItem[1][0].dataValues;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  findItems,
  findItemById,
  findItemByName,
  createItem,
  editItem,
  deleteItem,
  updateItemPhotos,
  updateStock,
};

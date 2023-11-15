const models = require("../../models")
const Item = models.Item

const findItems = async(page, size) => {
  const offset = (page-1) * size
  const ItemsAll = await Item.findAll()
  const dataLength = ItemsAll.length
  const items = await Item.findAll({
    offset: offset,
    limit: size
  })
  return { items, dataLength }
}

const findItemById = async(id) => {
  const item = await Item.findOne({
    where: {
      id,
    }
  })
  return item
}

const findItemByName = async(name) => {
  const item = await Item.findOne({
    where: {
      name,
    }
  })
  return item
}

function generateNewId(existingIds) {
  const maxNumber = existingIds.reduce((max, item) => {
    const currentNumber = parseInt(item.id.split("-")[1], 10);
    return currentNumber > max ? currentNumber : max;
  }, 0);

  const newNumber = maxNumber + 1;
  const newId = `I-${String(newNumber).padStart(4, "0")}`;

  console.log(newId)

  return newId;
}

const createItem = async(itemData) => {
  const existingIds = await Item.findAll({ attributes: ["id"] });
  const newId = generateNewId(existingIds)

  const item = await Item.create({
    id: newId,
    name: itemData.name,
    description: itemData.description,
    category_id: itemData.category_id,
    price: itemData.price,
    stock: itemData.stock,
    image_url: itemData.image_url,
  })

  return item
}

const editItem = async(id, itemData) => {
  const updatedItem = await Item.update(
    {
      name: itemData.name,
      description: itemData.description,
      category_id: itemData.category_id,
      price: itemData.price,
      stock: itemData.stock,
      image_url: itemData.image_url,
    },
    {
      where: {
        id,
      },
      returning: true
    }
  )

  return updatedItem
}

const deleteItem = async(id) => {
  const item = await Item.destroy({
    where: {
      id,
    }
  })

  return item
}

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

module.exports = {
  findItems,
  findItemById,
  findItemByName,
  createItem,
  editItem,
  deleteItem,
  updateItemPhotos
}

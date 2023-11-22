const {
  findItems,
  findItemById,
  findItemByName,
  createItem,
  editItem,
  deleteItem,
  updateItemPhotos,
  updateStock,
} = require("../repository/item.repository")

const getAllItems = async (page, size) => {
  const items = await findItems(page, size)
  return items
}

const getItemById = async (id) => {
  const item = await findItemById(id)

  if (!item) {
    throw Error("Item tidak ditemukan")
  }

  return item
}

const insertItem = async (newItem) => {
  const itemName = await findItemByName(newItem.name)

  if (itemName) {
    throw new Error("Data sudah terdaftar")
  }

  const item = await createItem(newItem)

  return item
}

const editItemById = async (id, newItem) => {
  await findItemByName(newItem.name)

  await getItemById(id)

  const item = await editItem(id, newItem)

  return item
}

const deleteItemById = async (id) => {
  await getItemById(id)
  await deleteItem(id)
}

const updateItemPhoto = async (id, image_url) => {
  try {
    return await updateItemPhotos(id, image_url)
  } catch (error) {
    throw error
  }
}

const decreaseStock = async (minus, id) => {
  const item = await getItemById(id)
  const newStock = item.stock - minus
  await updateStock(id, newStock)
}

const increaseStock = async (plus, id) => {
  const item = await getItemById(id)
  const newStock = item.stock + plus
  await updateStock(id, newStock)
}

module.exports = {
  getAllItems,
  getItemById,
  insertItem,
  editItemById,
  deleteItemById,
  updateItemPhoto,
  decreaseStock,
  increaseStock,
}

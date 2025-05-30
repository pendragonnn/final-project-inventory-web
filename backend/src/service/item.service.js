const {
	findItems,
	findItemById,
	// findItemByName,
	createItem,
	editItem,
	deleteItem,
	// updateItemPhotos,
	updateStock,
	findItemStock,
} = require("../repository/item.repository");

const getAllItems = async (page, size) => {
	const items = await findItems(page, size);
	return items;
};

const getFindItemStock = async (size) => {
	const items = await findItemStock(size);
	return items;
};

const getItemById = async (id) => {
	const item = await findItemById(id);

	if (!item) {
		throw Error("Item Not Found");
	}

	return item;
};

const insertItem = async (newItem) => {
	const item = await createItem(newItem);

	return item;
};

const editItemById = async (id, newItem) => {
	const existingItem = await getItemById(id);

	if (!existingItem) {
		throw new Error("Outlet Not Found");
	}

	const updatedItem = await editItem(id, newItem);

	return updatedItem;
};

const deleteItemById = async (id) => {
	await getItemById(id);
	await deleteItem(id);
};

// const updateItemPhoto = async (id, image_url) => {
// 	try {
// 		return await updateItemPhotos(id, image_url);
// 	} catch (error) {
// 		throw error;
// 	}
// };

const decreaseStock = async (minus, id) => {
	const item = await getItemById(id);
	const newStock = item.stock - minus;
	await updateStock(id, newStock);
};

const increaseStock = async (plus, id) => {
	const item = await getItemById(id);
	const newStock = item.stock + plus;
	await updateStock(id, newStock);
};

module.exports = {
	getAllItems,
	getItemById,
	insertItem,
	editItemById,
	deleteItemById,
	// updateItemPhoto,
	decreaseStock,
	increaseStock,
	getFindItemStock,
};

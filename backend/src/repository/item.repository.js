const models = require("../../models");
const Item = models.Item;
const Category = models.Category;
const Brand = models.Brand;

const findItems = async (page, size) => {
	const offset = (page - 1) * size;
	const ItemsAll = await Item.findAll({
		include: [
			{
				model: Brand,
			},
		],
	});
	const dataLength = ItemsAll.length;
	const items = await Item.findAll({
		include: [
			{
				model: Brand,
				include: [
					{
						model: Category,
						attributes: ["name"],
					},
				],
			},
		],
		offset: offset,
		limit: size,
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
				model: Brand,
				include: [
					{
						model: Category,
						attributes: ["name"],
					},
				],
			},
		],
	});

	return item;
};

// const findItemByName = async (name) => {
// 	const item = await Item.findOne({
// 		where: {
// 			name,
// 		},
// 	});
// 	return item;
// };

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

	const brand = await Brand.findByPk(itemData.brand_id);

	if (!brand) {
		throw new Error("Brand not found");
	}

	// Cek apakah ada item dengan name dan type yang sama, serta size yang sama
	const existingItem = await Item.findOne({
		where: {
			brand_id: itemData.brand_id,
			size: itemData.size,
		},
		include: {
			model: Brand,
			where: {
				name: brand.name, // Cek nama brand yang sama
				type: brand.type, // Cek type brand yang sama
			},
		},
	});

	if (existingItem) {
		throw new Error(
			`Size ${itemData.size} already exists for brand ${brand.name} with type ${brand.type}`
		);
	}

	const item = await Item.create({
		id: newId,
		description: itemData.description,
		price: itemData.price,
		size: itemData.size,
		stock: itemData.stock,
		brand_id: itemData.brand_id,
	});

	return item;
};

const editItem = async (id, updatedFields) => {
	const { description, brand_id, stock, price, size } = updatedFields;
	const item = await Item.findByPk(id);

	if (!item) {
		throw new Error("Item not found");
	}

	// Jika ada perubahan size, kita perlu memeriksa apakah size tersebut sudah ada
	if (size !== undefined) {
		const brand = await Brand.findByPk(brand_id);

		if (!brand) {
			throw new Error("Brand not found");
		}

		// Cek apakah ada item lain dengan size yang sama untuk brand dan type yang sama
		const existingItem = await Item.findOne({
			where: {
				brand_id: brand_id,
				size: size,
			},
			include: {
				model: Brand,
				where: {
					name: brand.name, // Cek nama brand yang sama
					type: brand.type, // Cek type brand yang sama
				},
			},
		});

		if (existingItem && existingItem.id !== id) {
			throw new Error(
				`Size ${size} already exists for brand ${brand.name} with type ${brand.type}`
			);
		}
	}

	// Persiapkan data yang akan diupdate
	const updatedData = {};

	if (description !== undefined) {
		updatedData.description = description;
	}
	if (brand_id !== undefined) {
		updatedData.brand_id = brand_id;
	}
	if (stock !== undefined) {
		updatedData.stock = stock;
	}
	if (price !== undefined) {
		updatedData.price = price;
	}
	if (size !== undefined) {
		updatedData.size = size;
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

// const updateItemPhotos = async (id, image_url) => {
// 	try {
// 		const updatedItem = await Item.update(
// 			{ image_url: image_url },
// 			{ where: { id }, returning: true }
// 		);

// 		if (updatedItem[0] === 0) return null;

// 		return updatedItem[1][0].dataValues;
// 	} catch (error) {
// 		throw error;
// 	}
// };

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
	// findItemByName,
	createItem,
	editItem,
	deleteItem,
	// updateItemPhotos,
	updateStock,
};

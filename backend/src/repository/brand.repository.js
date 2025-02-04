const models = require("../../models");
const Brand = models.Brand;
const Category = models.Category;

const findBrands = async (page, size) => {
	const offset = (page - 1) * size;
	const brandsAll = await Brand.findAll({
		include: [
			{
				model: Category,
			},
		],
	});
	const dataLength = brandsAll.length;
	const brands = await Brand.findAll({
		include: [
			{
				model: Category,
			},
		],
		offset: offset,
		limit: size,
		order: [["id", "DESC"]],
	});
	return { brands, dataLength };
};

const findBrandById = async (id) => {
	const brand = await Brand.findOne({
		where: {
			id,
		},

		include: [
			{
				model: Category,
			},
		],
	});

	return brand;
};

const findBrandByName = async (name) => {
	const brand = await Brand.findOne({
		where: {
			name,
		},
	});
	return brand;
};

const findBrandByType = async (type) => {
	const brand = await Brand.findOne({
		where: {
			type,
		},
	});
	return brand;
};

function generateNewId(existingIds) {
	const maxNumber = existingIds.reduce((max, id) => {
		const currentNumber = parseInt(id.split("-")[1], 10);
		return currentNumber > max ? currentNumber : max;
	}, 0);

	const newNumber = maxNumber + 1;
	const newId = `B-${String(newNumber).padStart(4, "0")}`;

	return newId;
}

const createBrand = async (brandData) => {
	const existingIds = await Brand.findAll({ attributes: ["id"] });
	const newId = generateNewId(existingIds.map((brand) => brand.id));

	const category = await Category.findByPk(brandData.category_id);

	if (!category) {
		throw new Error("Category not found");
	}
	const brand = await Brand.create({
		id: newId,
		name: brandData.name,
		type: brandData.type,
		category_id: brandData.category_id,
		image_url: brandData.image_url,
	});
	return brand;
};

const editBrand = async (id, updatedFields) => {
	const { name, type, category_id, image_url } = updatedFields;
	const brand = await Brand.findByPk(id);

	if (!brand) {
		throw new Error("Brand not found");
	}

	const updatedData = {};

	if (name !== undefined && name !== brand.name) {
		updatedData.name = name;
	}

	if (type !== undefined && type !== brand.type) {
		updatedData.type = type;
	}

	if (category_id !== undefined && category_id !== brand.category_id) {
		updatedData.category_id = category_id;
	}

	if (image_url !== undefined && image_url !== brand.image_url) {
		updatedData.image_url = image_url;
	}

	if (Object.keys(updatedData).length === 0) {
		return brand;
	}

	const updatedBrands = await Brand.update(updatedData, {
		where: {
			id: id,
		},
	});
	return updatedBrands;
};

const updateBrandPhotos = async (id, image_url) => {
	const updatedBrand = await Brand.update(
		{ image_url: image_url },
		{ where: { id }, returning: true }
	);
	if (updatedBrand[0] === 0) return null;

	return updatedBrand[1][0].dataValues;
};

const deleteBrand = async (id) => {
	const brand = await Brand.destroy({
		where: {
			id,
		},
	});
	return brand;
};

module.exports = {
	findBrands,
	findBrandById,
	createBrand,
	editBrand,
	deleteBrand,
	findBrandByName,
	findBrandByType,
	updateBrandPhotos,
};

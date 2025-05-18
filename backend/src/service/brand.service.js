const {
	findBrands,
	findBrandById,
	findBrandByType,
	createBrand,
	editBrand,
	deleteBrand,
	updateBrandPhotos,
	findBrandByName,
	findBrandByNameAndType,
} = require("../repository/brand.repository");

const getAllBrands = async (page, size) => {
	const brands = await findBrands(page, size);
	return brands;
};

const getBrandById = async (id) => {
	const brand = await findBrandById(id);
	if (!brand) {
		throw new Error("Brand not found");
	}
	return brand;
};

const insertBrand = async (newBrand) => {
	const existingBrand = await findBrandByNameAndType(
		newBrand.name,
		newBrand.type
	);

	if (existingBrand) {
		throw new Error("Brand already exists with the same name and type.");
	}

	const brand = await createBrand(newBrand);
	return brand;
};

const updateBrandPhoto = async (id, image_url) => {
	try {
		return await updateBrandPhotos(id, image_url);
	} catch (error) {
		throw error;
	}
};

const editBrandById = async (id, newBrand) => {
	const brand = await findBrandById(id);
	if (!brand) {
		throw new Error("Brand not found");
	}

	const existingBrand = await findBrandByNameAndType(
		newBrand.name,
		newBrand.type
	);

	if (existingBrand && existingBrand.id !== id) {
		throw new Error("Brand already exists with the same name and type.");
	}

	const updatedBrand = await editBrand(id, newBrand);
	return updatedBrand;
};

const deleteBrandById = async (id) => {
	const brand = await findBrandById(id);
	if (!brand) {
		throw new Error("Brand not found");
	}
	const deletedBrand = await deleteBrand(id);
	return deletedBrand;
};

module.exports = {
	getAllBrands,
	getBrandById,
	insertBrand,
	editBrandById,
	deleteBrandById,
	updateBrandPhoto,
};

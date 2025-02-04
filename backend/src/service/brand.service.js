const {
	findBrands,
	findBrandById,
	findBrandByType,
	createBrand,
	editBrand,
	deleteBrand,
	updateBrandPhotos,
	findBrandByName,
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
	const brandName = await findBrandById(newBrand.name);
	const brandType = await findBrandByType(newBrand.type);

	if (brandName || brandType) {
		throw new Error("Brand already exist");
	}
	const brand = await createBrand(newBrand);
	return brand;
};

const editBrandById = async (id, newBrand) => {
	const brand = await findBrandById(id);
	if (!brand) {
		throw new Error("Brand not found");
	}

	const brandType = await findBrandByType(newBrand.type);

	if (brandType && brandType.id !== id) {
		throw new Error("Brand type already exist");
	}

	const updatedBrand = await editBrand(id, newBrand);
	return updatedBrand;
};

const updateBrandPhoto = async (id, image_url) => {
	try {
		return await updateBrandPhotos(id, image_url);
	} catch (error) {
		throw error;
	}
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

const {
	getAllBrands,
	getBrandById,
	insertBrand,
	updateBrandPhoto,
	editBrandById,
	deleteBrandById,
} = require("../service/brand.service");

const allBrands = async (req, res) => {
	const page = req.query.page || 1;
	const size = req.query.size || 10;
	try {
		const { brands, dataLength } = await getAllBrands(page, size);
		res.status(200).json({
			data: brands,
			totalItems: dataLength,
			currentPage: parseInt(page),
			totalPages: Math.ceil(dataLength / size),
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const brandById = async (req, res) => {
	try {
		const brandId = req.params.id;
		const brand = await getBrandById(brandId);
		res.status(200).json({ data: brand });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const postBrand = async (req, res) => {
	try {
		const newBrandData = req.body;

		const brand = await insertBrand(newBrandData);

		res.status(200).json({ data: brand, message: "Successful Adding Brand!" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const updateBrand = async (req, res) => {
	const brandId = req.params.id;
	const brandData = req.body;

	try {
		const brand = await editBrandById(brandId, brandData);
		if (!brand) {
			return res
				.status(400)
				.json({ message: "Brand Not Found or Already Added" });
		}
		res
			.status(200)
			.json({ data: brand, message: "Successful Updating Brand!" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const removeBrand = async (req, res) => {
	try {
		const brandId = req.params.id;

		await deleteBrandById(brandId);
		res.status(200).json({ message: "Successful Delete Brand!" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const uploadBrandPhoto = async (req, res) => {
	try {
		const id = req.params.id;
		const brand = await getBrandById(id);

		if (!brand) {
			return res.status(404).json({ message: "Brand not found" });
		}

		if (!req.file) {
			return res.status(400).json({ message: "No file uploaded" });
		}

		const image_url = req.file.filename;

		const updatedBrand = await updateBrandPhoto(id, image_url);

		res.status(200).json({
			message: "Brand photo updated successfully",
			data: updatedBrand,
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

module.exports = {
	allBrands,
	brandById,
	postBrand,
	updateBrand,
	removeBrand,
	uploadBrandPhoto,
};

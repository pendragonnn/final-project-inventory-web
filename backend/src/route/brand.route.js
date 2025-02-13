const express = require("express");
const brandController = require("../controller/brand.controller");
const { brandValidator } = require("../middleware/data.validator.middleware");
const {
	upload,
	uploadDir,
	multerErrorHandler,
} = require("../../config/multer.brand.config");
const router = express.Router();

router.get("/", brandController.allBrands);
router.get("/:id", brandController.brandById);
router.post("/", brandValidator, brandController.postBrand);
router.post(
	"/upload/:id",
	upload.single("image_url"),
	multerErrorHandler,
	brandController.uploadBrandPhoto
);
router.put("/:id", brandValidator, brandController.updateBrand);
router.delete("/:id", brandController.removeBrand);
router.use("/upload", express.static(uploadDir));

module.exports = router;

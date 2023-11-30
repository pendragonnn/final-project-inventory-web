const express = require("express")
const router = express.Router()
const {upload, uploadDir } = require("../../config/multer.item.config")
const itemsController = require("../controller/item.controller")
const { itemValidator } = require("../middleware/data.validator.middleware")

router.get("/", itemsController.allItems)
router.get("/:id", itemsController.itemById)
router.post("/", itemValidator,itemsController.postItem)
// router.post(
//     "/upload/:id",
//     upload.single("image_url"),
//     userController.uploadItemPhoto
//   );
router.post("/upload/:id", upload.single("image_url"), itemsController.uploadItemPhoto)
router.put("/:id", itemValidator,itemsController.updateItem)
router.delete("/:id", itemsController.removeItem)
router.use("/upload", express.static(uploadDir))

module.exports = router

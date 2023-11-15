const express = require("express");
const categoryController = require("../controller/category.controller");
const route = express.Router();
const {categoryValidator} = require('../middleware/data.validator.middleware')

route.get("/", categoryController.allCategories);
route.get("/:id", categoryController.categoryById);
route.post("/", categoryValidator,categoryController.postCategory);
route.put("/:id", categoryValidator, categoryController.updateCategory);
route.delete("/:id", categoryController.removeCategory);

module.exports = route;

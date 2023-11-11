const express = require("express");
const router = express.Router();

const supplierRoutes = require("./supplier.route");

router.use("/suppliers", supplierRoutes);

module.exports = router;

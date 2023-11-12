const express = require("express");
const router = express.Router();

const suppliersRoutes = require("../route/supplier.route");

router.use("/", suppliersRoutes);

module.exports = router;

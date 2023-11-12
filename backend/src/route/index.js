const express = require("express");
const router = express.Router();

const suppliersRoutes = require("../route/supplier.route");
router.use("/", suppliersRoutes);
const outletsRoutes = require("../route/outlet.route");
router.use("/", outletsRoutes);

module.exports = router;

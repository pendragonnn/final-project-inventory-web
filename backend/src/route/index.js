const express = require("express");
const router = express.Router();

const suppliersRoutes = require("../route/supplier.route");
router.use("/", suppliersRoutes);
const outletsRoutes = require("../route/outlet.route");
router.use("/", outletsRoutes);
const userRouter = require("./userRouter");
router.use("/", userRouter);
const itemRouter = require("./items");
router.use("/", itemRouter)

module.exports = router;

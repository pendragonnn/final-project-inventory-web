const express = require("express");
const router = express.Router();
const transactionheaderRoutes = require("./transactionheader.route");
const transactiondetailRoutes = require("./transactiondetail.route");
const suppliersRoutes = require("../route/supplier.route");
const outletsRoutes = require("../route/outlet.route");
const userRouter = require("./userRouter");
const itemRouter = require("./items");

const authRoutes = require("./auth.route");
router.use("/", authRoutes);
const suppliersRoutes = require("../route/supplier.route");
router.use("/", suppliersRoutes);
const outletsRoutes = require("../route/outlet.route");
router.use("/", outletsRoutes);
const userRouter = require("./userRouter");
router.use("/", userRouter);
const itemRouter = require("./items");
router.use("/", itemRouter);

module.exports = router;

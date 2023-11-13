const express = require("express");
const router = express.Router();

const authRoutes = require("./auth.route");
router.use("/", authRoutes);
const suppliersRoutes = require("../route/supplier.route");
router.use("/", suppliersRoutes);
const outletsRoutes = require("../route/outlet.route");
router.use("/", outletsRoutes);
const userRouter = require("./userRouter");
router.use("/", userRouter);

module.exports = router;

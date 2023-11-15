const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const transactionheaderRoutes = require("./transactionheader.route");
const transactiondetailRoutes = require("./transactiondetail.route");
const suppliersRoutes = require("../route/supplier.route");
const outletsRoutes = require("../route/outlet.route");
const userRouter = require("./userRouter");
const itemRouter = require("./items");
const authRoutes = require("./auth.route");

router.use("/", authRoutes);
router.use("/transaction_header", authMiddleware, transactionheaderRoutes);
router.use("/transaction_detail", authMiddleware, transactiondetailRoutes);
router.use("/", authMiddleware, itemRouter);
router.use("/", authMiddleware, suppliersRoutes);
router.use("/", authMiddleware, outletsRoutes);
router.use("/", authMiddleware, userRouter);

module.exports = router;

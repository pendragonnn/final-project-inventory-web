const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const transactionheaderRoutes = require("./transaction.header.route");
const transactiondetailRoutes = require("./transaction.detail.route");
const suppliersRoutes = require("../route/supplier.route");
const outletsRoutes = require("../route/outlet.route");
const userRouter = require("./user.route");
const itemRouter = require("./item.route");
const categoryRoutes = require("./category.route");
const roleRoutes = require("./role.route");

router.use(authMiddleware.authenticateToken);
router.use("/transaction-header", transactionheaderRoutes);
router.use("/transaction-detail", transactiondetailRoutes);
router.use("/item", itemRouter);
router.use("/supplier", suppliersRoutes);
router.use("/outlet", outletsRoutes);
router.use("/user", userRouter);
router.use("/category", categoryRoutes);
router.use("/role", roleRoutes);

module.exports = router;

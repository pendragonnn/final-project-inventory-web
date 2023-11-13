const express = require("express")
const router = express.Router()
const transactionheaderRoutes = require("./transactionheader.route")
const transactiondetailRoutes = require("./transactiondetail.route")
const suppliersRoutes = require("../route/supplier.route")
const outletsRoutes = require("../route/outlet.route")
const userRouter = require("./userRouter")
const itemRouter = require("./items")

<<<<<<< HEAD
const suppliersRoutes = require("../route/supplier.route");
router.use("/", suppliersRoutes);
const outletsRoutes = require("../route/outlet.route");
router.use("/", outletsRoutes);
const userRouter = require("./userRouter");
router.use("/", userRouter);
const itemRouter = require("./items");
router.use("/", itemRouter)
=======
router.use("/transaction_header", transactionheaderRoutes)
router.use("/transaction_detail", transactiondetailRoutes)
router.use("/", itemRouter)
router.use("/", suppliersRoutes)
router.use("/", outletsRoutes)
router.use("/", userRouter)
>>>>>>> c29588e46941271a99bd2703f39c74fb02b7b553

module.exports = router

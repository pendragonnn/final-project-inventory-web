const express = require("express")
const router = express.Router()
const transactionheaderRoutes = require("./transactionheader.route")
const transactiondetailRoutes = require("./transactiondetail.route")
const suppliersRoutes = require("../route/supplier.route")
const outletsRoutes = require("../route/outlet.route")
const userRouter = require("./userRouter")
const itemRouter = require("./items")

router.use("/transaction_header", transactionheaderRoutes)
router.use("/transaction_detail", transactiondetailRoutes)
router.use("/", itemRouter)
router.use("/", suppliersRoutes)
router.use("/", outletsRoutes)
router.use("/", userRouter)

module.exports = router

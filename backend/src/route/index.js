const express = require("express")
const router = express.Router()

const transactionheaderRoutes = require("./transactionheader.route")
const transactiondetailRoutes = require("./transactiondetail.route")

router.use("/transaction_header", transactionheaderRoutes)
router.use("/transaction_detail", transactiondetailRoutes)
const suppliersRoutes = require("../route/supplier.route")
router.use("/", suppliersRoutes)
const outletsRoutes = require("../route/outlet.route")
router.use("/", outletsRoutes)
const userRouter = require("./userRouter")
router.use("/", userRouter)

module.exports = router

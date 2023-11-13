const express = require("express")
const router = express.Router()

const transactionheaderRoutes = require("./transactionheader.route")
const transactiondetailRoutes = require("./transactiondetail.route")

router.use("/transaction_header", transactionheaderRoutes)
router.use("/transaction_detail", transactiondetailRoutes)

module.exports = router

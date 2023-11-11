const express = require("express")
const router = express.Router()

const transactionheaderRoutes = require("./transactionheader.route")

router.use("/", transactionheaderRoutes)

module.exports = router

const express = require("express")
const transactiondetailController = require("../controller/transaction.detail.controller")
const route = express.Router()

route.get("/:id", transactiondetailController.transactionDetailById)

module.exports = route

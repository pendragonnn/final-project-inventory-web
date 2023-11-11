const express = require("express")
const transactionheaderController = require("../controller/transactionheader.controller")
const route = express.Router()

route.get(
  "/transaction_header",
  transactionheaderController.allTransactionHeader
)

route.get(
  "/transaction_header/:id",
  transactionheaderController.transactionheaderById
)

route.post(
  "/transaction_header",
  transactionheaderController.postTransactionHeader
)

route.put(
  "/transaction_header/:id",
  transactionheaderController.updateTransactionHeader
)

route.delete(
  "/transaction_header/:id",
  transactionheaderController.removeTransactionHeader
)

module.exports = route

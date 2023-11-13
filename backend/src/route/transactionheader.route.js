const express = require("express")
const transactionheaderController = require("../controller/transactionheader.controller")
const route = express.Router()

route.get("/", transactionheaderController.allTransactionHeader)

route.get("/:id", transactionheaderController.transactionheaderById)

route.post("/", transactionheaderController.postTransactionHeader)

route.put("/:id", transactionheaderController.updateTransactionHeader)

route.delete("/:id", transactionheaderController.removeTransactionHeader)

module.exports = route

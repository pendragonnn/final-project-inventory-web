const express = require("express")
const transactionheaderController = require("../controller/transaction.header.controller")
const {
  transactionHeaderValidator,
} = require("../middleware/data.validator.middleware")
const route = express.Router()

route.get("/", transactionheaderController.allTransactionHeader)
route.get("/receiving", transactionheaderController.alltransactionReceiving)
route.get("/isuing", transactionheaderController.alltransactionIsuing)
route.get("/:id", transactionheaderController.transactionHeaderById)
route.post(
  "/",
  transactionHeaderValidator,
  transactionheaderController.postTransactionHeader
)
route.put(
  "/:id",
  transactionHeaderValidator,
  transactionheaderController.updateTransactionHeader
)
route.delete("/:id", transactionheaderController.removeTransactionHeader)

module.exports = route

const {
  // findTransactionHeadertById,
  createTransactionDetail,
} = require("../repository/transaction.header.repository")

const {
  findsTransactionDetail,
} = require("../repository/transaction.detail.repository")

const {
  findTransactionDetailtById,
} = require("../repository/transaction.detail.repository")

const getAllTransactionDetail = async (page, size) => {
  const transactionDetail = await findsTransactionDetail(page, size)
  return transactionDetail
}

const getTransactionDetailById = async (id) => {
  const transactionDetail = await findTransactionDetailtById(id)

  if (!transactionDetail) {
    throw Error("Transaction Detail Not Found")
  }
  return transactionDetail
}

const insertTransactionDetail = async (newTransactionDetail, header_id) => {
  const transactiondetail = await createTransactionDetail(
    newTransactionDetail,
    header_id
  )

  return transactiondetail
}

module.exports = {
  getTransactionDetailById,
  insertTransactionDetail,
  getAllTransactionDetail,
}

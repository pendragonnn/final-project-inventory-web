const {
  findTransactionHeadertById,
} = require("../repository/transaction.header.repository")

const getTransactionDetailById = async (header_id) => {
  const transactionDetail = await findTransactionHeadertById(header_id)

  if (!transactionDetail) {
    throw Error("transaction Detail tidak ditemukan")
  }
  return transactionDetail
}

module.exports = {
  getTransactionDetailById,
}

const {
  findTransactionDetail,
  findTransactionDetailtById,
} = require("../repository/transactiondetail.repository")

const getAllTransactionDetail = async () => {
  const transactionDetail = await findTransactionDetail()
  return transactionDetail
}

const getTransactionDetailById = async (header_id) => {
  const transactionDetail = await findTransactionDetailtById(header_id)

  if (!transactionDetail) {
    throw Error("transaction Detail not found")
  }
  return transactionDetail
}

module.exports = {
  getAllTransactionDetail,
  getTransactionDetailById,
}

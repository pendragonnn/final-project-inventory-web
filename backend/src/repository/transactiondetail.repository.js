const models = require("../../models")
const TransactionsDetail = models.TransactionDetail

const findTransactionDetail = async () => {
  const transactionsDetails = await TransactionsDetail.findAll()

  return transactionsDetails
}

const findTransactionDetailtById = async (header_id) => {
  const transactionDetail = await TransactionsDetail.findOne({
    where: {
      header_id,
    },
  })
  return transactionDetail
}

module.exports = {
  findTransactionDetail,
  findTransactionDetailtById,
}

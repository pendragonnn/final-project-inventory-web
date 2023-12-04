const models = require("../../models")
const TransactionsDetail = models.TransactionDetail
const TransactionHeader = models.TransactionHeader
const Item = models.Item

const findsTransactionDetail = async (page, size) => {
  const offset = (page - 1) * size
  const transactionDetailsAll = await TransactionsDetail.findAll({
    include: [
      {
        model: Item,
      },
    ],
  })
  const dataLength = transactionDetailsAll.length
  const transactionDetails = await TransactionsDetail.findAll({
    offset: offset,
    limit: size,
    include: [
      {
        model: Item,
      },
    ],
  })
  return { transactionDetails, dataLength }
}

const findTransactionDetailtById = async (id) => {
  const transactionDetail = await TransactionHeader.findOne({
    include: [
      {
        model: TransactionsDetail,
        include: [
          {
            model: Item,
          },
        ],
      },
    ],
    where: {
      id,
    },
  })

  return transactionDetail
}

module.exports = {
  findTransactionDetailtById,
  findsTransactionDetail,
}

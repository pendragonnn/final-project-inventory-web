const models = require("../../models")
const TransactionsDetail = models.TransactionDetail

const findTransactionDetail = async (page, size) => {
  const offset = (page-1) * size
  const transactionDetailsAll = await TransactionsDetail.findAll()
  const dataLength = transactionDetailsAll.length
  const transactionDetails = await TransactionsDetail.findAll({
    offset: offset,
    limit: size
  })
  return { transactionDetails, dataLength }
}

const findTransactionDetailtById = async (id) => {
  const transactionDetail = await TransactionsDetail.findOne({
    where: {
      id,
    },
  })
  return transactionDetail
}

const findTransactionDetailtByUserId = async (user_id) => {
  const transactionDetail = await TransactionsDetail.findOne({
    where: {
      user_id,
    },
  })
  return transactionDetail
}

const findTransactionDetailtByOutletId = async (outlet_id) => {
  const transactionDetail = await TransactionsDetail.findOne({
    where: {
      outlet_id,
    },
  })
  return transactionDetail
}

const findTransactionDetailtBySupplierId = async (supplier_id) => {
  const transactionDetail = await TransactionsDetail.findOne({
    where: {
      supplier_id,
    },
  })
  return transactionDetail
}

function generateNewId(existingIds) {
  const maxNumber = existingIds.reduce((max, id) => {
    const currentNumber = parseInt(id.split("-")[1], 10)
    return currentNumber > max ? currentNumber : max
  }, 0)

  const newNumber = maxNumber + 1
  const newId = `TD-${String(newNumber).padStart(4, "0")}`

  return newId
}

const createTransactionDetail = async (transactionDetailData) => {
  try {
    const existingIds = await TransactionsDetail.findAll({
      attributes: ["id"],
    })

    const newId = generateNewId(
      existingIds.map((transactionDetail) => transactionDetail.id)
    )

    const transactionDetail = await TransactionsDetail.create({
      id: newId,
      header_id: transactionDetailData.header_id,
      item_id: transactionDetailData.item_id,
      quantity: transactionDetailData.quantity,
      unit_price: transactionDetailData.unit_price,
      total_price: transactionDetailData.total_price,
    })

    return transactionDetail
  } catch (error) {
    throw error
  }
}

const editTransactionDetail = async (id, transactionDetailData) => {
  const updatedTransactionDetail = await TransactionsDetail.update(
    {
      header_id: transactionDetailData.header_id,
      item_id: transactionDetailData.item_id,
      quantity: transactionDetailData.quantity,
      unit_price: transactionDetailData.unit_price,
      total_price: transactionDetailData.total_price,
    },
    {
      where: {
        id: id,
      },
      returning: true,
    }
  )

  return updatedTransactionDetail
}

const deleteTransactionDetail = async (id) => {
  const transactionDetail = await TransactionsDetail.destroy({
    where: {
      id,
    },
  })
  return transactionDetail
}

module.exports = {
  findTransactionDetail,
  findTransactionDetailtById,
  findTransactionDetailtByUserId,
  findTransactionDetailtByOutletId,
  findTransactionDetailtBySupplierId,
  createTransactionDetail,
  editTransactionDetail,
  deleteTransactionDetail,
}

const {
  findTransactionDetail,
  findTransactionDetailtById,
  findTransactionDetailtByUserId,
  findTransactionDetailtByOutletId,
  findTransactionDetailtBySupplierId,
  createTransactionDetail,
  editTransactionDetail,
  deleteTransactionDetail,
} = require("../repository/transaction.detail.repository")

const getAllTransactionDetail = async (page, size) => {
  const transactionDetail = await findTransactionDetail(page, size)
  return transactionDetail
}

const getTransactionDetailById = async (id) => {
  const transactionDetail = await findTransactionDetailtById(id)

  if (!transactionDetail) {
    throw Error("transaction Detail tidak ditemukan")
  }
  return transactionDetail
}

const insertTransactionDetail = async (newTransactionDetail) => {
  const transactionDetail = await createTransactionDetail(newTransactionDetail)

  return transactionDetail
}

const editTransactionDetailById = async (id, newTransactionDetail) => {
  try {
    await getTransactionDetailById(id)
    
    const transactionDetail = await editTransactionDetail(
      id,
      newTransactionDetail
    )

    return transactionDetail
  } catch (err) {
    return null
  }
}

const deleteTransactionDetailById = async (id) => {
  try {
    await getTransactionDetailById(id)

    await deleteTransactionDetail(id)
  } catch (err) {
    throw err
  }
}

module.exports = {
  getAllTransactionDetail,
  getTransactionDetailById,
  insertTransactionDetail,
  editTransactionDetailById,
  deleteTransactionDetailById,
}

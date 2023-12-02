const {
  findsTransactionHeader,
  findTransactionHeadertById,
  findsTransactionHeaderIsuing,
  findsTransactionHeaderReceiving,
  createTransactionHeader,
  deleteTransactionHeader,
  editTransactionHeader,
} = require("../repository/transaction.header.repository")

const getAllTransactionHeader = async (page, size) => {
  const transactionHeader = await findsTransactionHeader(page, size)
  return transactionHeader
}

const getTransactionHeaderReceiving = async (page, size) => {
  const transactionReceiving = await findsTransactionHeaderReceiving(page, size)
  return transactionReceiving
}

const getTransactionHeaderIsuing = async (page, size) => {
  const transactionIsuing = await findsTransactionHeaderIsuing(page, size)
  return transactionIsuing
}

const getTransactionHeaderById = async (id) => {
  const transactionHeader = await findTransactionHeadertById(id)

  if (!transactionHeader) {
    throw Error("Transaction Header Not Found")
  }

  return transactionHeader
}

const insertTransactionHeader = async (newTransactionHeaderData) => {
  try {
    // Memastikan bahwa fungsi createTransactionHeader mengembalikan header yang dibuat
    const transactionHeader = await createTransactionHeader(
      newTransactionHeaderData
    )

    return transactionHeader // Pastikan untuk mengembalikan header yang dibuat
  } catch (error) {
    throw error
  }
}

const editTransactionHeaderById = async (id, newTransactionHeader) => {
  try {
    await getTransactionHeaderById(id)

    const transactionHeader = await editTransactionHeader(
      id,
      newTransactionHeader
    )
    return transactionHeader
  } catch (err) {
    return null
  }
}

const deleteTransactionHeaderById = async (id) => {
  try {
    await getTransactionHeaderById(id)
    await deleteTransactionHeader(id)
  } catch (err) {
    throw err
  }
}

module.exports = {
  getAllTransactionHeader,
  getTransactionHeaderById,
  getTransactionHeaderReceiving,
  getTransactionHeaderIsuing,
  insertTransactionHeader,
  editTransactionHeaderById,
  deleteTransactionHeaderById,
}

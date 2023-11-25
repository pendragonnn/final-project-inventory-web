const models = require("../../models")
const TransactionsHeaders = models.TransactionHeader

const findsTransactionHeader = async () => {
  const transactionsHeaders = await TransactionsHeaders.findAll()

  return transactionsHeaders
}

const findTransactionHeadertById = async (id) => {
  const transactionheader = await TransactionsHeaders.findOne({
    where: {
      id,
    },
  })
  return transactionheader
}

const findTransactionHeadertByUserId = async (user_id) => {
  const transactionheader = await TransactionsHeaders.findOne({
    where: {
      user_id,
    },
  })
  return transactionheader
}

const findTransactionHeadertByOutletId = async (outlet_id) => {
  const transactionheader = await TransactionsHeaders.findOne({
    where: {
      outlet_id,
    },
  })
  return transactionheader
}

const findTransactionHeadertBySupplierId = async (supplier_id) => {
  const transactionheader = await TransactionsHeaders.findOne({
    where: {
      supplier_id,
    },
  })
  return transactionheader
}

// Fungsi untuk membuat ID baru dengan format "O-XXXX"
function generateNewId(existingIds) {
  const maxNumber = existingIds.reduce((max, id) => {
    const currentNumber = parseInt(id.split("-")[1], 10)
    return currentNumber > max ? currentNumber : max
  }, 0)

  const newNumber = maxNumber + 1
  const newId = `TH-${String(newNumber).padStart(4, "0")}`

  return newId
}

const createTransactionHeader = async (transactionheaderData) => {
  try {
    // Mengambil semua ID yang sudah ada
    const existingIds = await TransactionsHeaders.findAll({
      attributes: ["id"],
    })

    // Membuat ID baru dengan format "O-XXXX"
    const newId = generateNewId(
      existingIds.map((transactionheader) => transactionheader.id)
    )

    // Menambahkan outlet baru
    const transactionheader = await TransactionsHeaders.create({
      id: newId,
      user_id: transactionheaderData.user_id,
      outlet_id: transactionheaderData.outlet_id,
      supplier_id: transactionheaderData.supplier_id,
      item_id: transactionheaderData.item_id,
      transaction_date: transactionheaderData.transaction_date,
      information: transactionheaderData.information,
      total_amount: transactionheaderData.total_amount,
    })

    return transactionheader
  } catch (error) {
    console.error("Gagal membuat transaction header:", error)
    throw error
  }
}

const editTransactionHeader = async (id, transactionheaderData) => {
  const updatedTransactionHeader = await TransactionsHeaders.update(
    {
      outlet_id: transactionheaderData.outlet_id,
      supplier_id: transactionheaderData.supplier_id,
      item_id: transactionheaderData.item_id,
      transaction_date: transactionheaderData.transaction_date,
      information: transactionheaderData.information,
      total_amount: transactionheaderData.total_amount,
    },
    {
      where: {
        id: id,
      },
      returning: true,
    }
  )

  return updatedTransactionHeader
}

const deleteTransactionHeader = async (id) => {
  const transactionheader = await TransactionsHeaders.destroy({
    where: {
      id,
    },
  })
  return transactionheader
}

module.exports = {
  findsTransactionHeader,
  findTransactionHeadertById,
  findTransactionHeadertByUserId,
  findTransactionHeadertByOutletId,
  findTransactionHeadertBySupplierId,
  createTransactionHeader,
  editTransactionHeader,
  deleteTransactionHeader,
}

const {
  findsTransactionHeader,
  findTransactionHeadertById,
  findTransactionHeadertByUserId,
  findTransactionHeadertByOutletId,
  findTransactionHeadertBySupplierId,
  createTransactionHeader,
  deleteTransactionHeader,
  editTransactionHeader,
} = require("../repository/transactionheader.repository")

const getAllTransactionHeader = async () => {
  const transactionheader = await findsTransactionHeader()
  return transactionheader
}

const getTransactionHeaderById = async (id) => {
  const transactionheader = await findTransactionHeadertById(id)

  if (!transactionheader) {
    throw Error("transaction header not found")
  }
  return transactionheader
}

const insertTransactionHeader = async (newTransactionHeader) => {
  const transactionheader = await createTransactionHeader(newTransactionHeader)

  return transactionheader
}

const editTransactionHeaderById = async (id, newTransactionHeader) => {
  try {
    // const outletName = await findOutletByName(newOutlet.name)
    // const outletPhone = await findOutletByPhone(newOutlet.phone)

    // if (outletName) {
    //   throw new Error("Name sudah Terdaftar")
    // }
    // if (outletPhone) {
    //   throw new Error("Nomor telepon sudah Terdaftar")
    // }

    await getTransactionHeaderById(id)

    const transactionheader = await editTransactionHeader(
      id,
      newTransactionHeader
    )
    return transactionheader
  } catch (err) {
    console.error(err) // Tambahkan log untuk melihat kesalahan
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
  insertTransactionHeader,
  editTransactionHeaderById,
  deleteTransactionHeaderById,
}

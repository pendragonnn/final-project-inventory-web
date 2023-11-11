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
    throw err("transaction header not found")
  }
  return transactionheader
}

const insertTransactionHeader = async (newTransactionHeader) => {
  // const transactionheaderUser_id = await findTransactionHeadertByUserId(
  //   newTransactionHeader.user_id
  // )
  // const transactionheaderOutlet_id = await findTransactionHeadertByOutletId(
  //   newTransactionHeader.outlet_id
  // )
  // const transactionheaderSupplier_id = await findTransactionHeadertBySupplierId(
  //   newTransactionHeader.supplier_id
  // )

  // if (transactionheaderUser_id) {
  //   throw new Error("User sudah terdaftar")
  // }
  // if (transactionheaderOutlet_id) {
  //   throw new Error("Outlet sudah terdaftar")
  // }
  // if (transactionheaderSupplier_id) {
  //   throw new Error("Supplier sudah terdaftar")
  // }

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

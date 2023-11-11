const {
  getAllTransactionHeader,
  getTransactionHeaderById,
  insertTransactionHeader,
  deleteTransactionHeaderById,
  editTransactionHeaderById,
} = require("../service/transactionheader.service")

const allTransactionHeader = async (req, res) => {
  const transactionheader = await getAllTransactionHeader()
  res.json(transactionheader)
}

const transactionheaderById = async (req, res) => {
  try {
    const transactionheaderId = req.params.id
    const transactionheader = await getTransactionHeaderById(
      transactionheaderId
    )

    res.send(transactionheader)
  } catch (err) {
    res.status(404).send(err.message)
  }
}

const postTransactionHeader = async (req, res) => {
  try {
    const newTransactionHeaderData = req.body

    const transactionheader = await insertTransactionHeader(
      newTransactionHeaderData
    )

    res.json({
      data: transactionheader,
      message: "Transaction berhasil ditambahkan",
    })
  } catch (err) {
    res.status(400).send(err.message)
  }
}

const updateTransactionHeader = async (req, res) => {
  const transactionheaderId = req.params.id
  const transactionheaderData = req.body

  if (
    !(transactionheaderData.information && transactionheaderData.total_amount)
  ) {
    return res.status(400).send("Data harus diisi semua")
  }

  try {
    const transactionheader = await editTransactionHeaderById(
      transactionheaderId,
      transactionheaderData
    )
    if (!transactionheader) {
      return res
        .status(400)
        .json({
          Error: "Data sudah ada atau Transaction Header tidak ditemukan",
        })
    }

    res.send({
      data: transactionheader,
      message: "Transaction Header berhasil diupdate!",
    })
  } catch (error) {
    console.error(error) // Tambahkan log untuk melihat kesalahan
    return res.status(500).json({ Error: "Terjadi kesalahan server" })
  }
}

const removeTransactionHeader = async (req, res) => {
  try {
    const transactionheaderId = req.params.id

    await deleteTransactionHeaderById(transactionheaderId)
    res.send("Data berhasil dihapus")
  } catch (err) {
    res.status(400).send(err.message)
  }
}

module.exports = {
  allTransactionHeader,
  transactionheaderById,
  postTransactionHeader,
  updateTransactionHeader,
  removeTransactionHeader,
}

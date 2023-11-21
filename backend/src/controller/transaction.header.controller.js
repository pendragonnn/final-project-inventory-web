const {
  getAllTransactionHeader,
  getTransactionHeaderById,
  insertTransactionHeader,
  deleteTransactionHeaderById,
  editTransactionHeaderById,
} = require("../service/transaction.header.service")

const {
  getItemById,
  decreaseStock,
  increaseStock,
} = require("../service/item.service")

const {
  insertTransactionDetail,
} = require("../service/transaction.detail.service")

const { error } = require("../schema/category.schema")

const allTransactionHeader = async (req, res) => {
  const page = req.query.page || 1
  const size = req.query.size || 10
  try {
    const { transactionHeaders, dataLength } = await getAllTransactionHeader(
      page,
      size
    )
    res.status(200).json({
      data: transactionHeaders,
      totalItems: transactionHeaders.length,
      currentPage: parseInt(page),
      totalPages: Math.ceil(dataLength / size),
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const transactionHeaderById = async (req, res) => {
  try {
    const transactionHeaderId = req.params.id
    const transactionHeader = await getTransactionHeaderById(
      transactionHeaderId
    )

    if (!transactionHeader) {
      return res
        .status(404)
        .json({ message: "Header transaksi tidak ditemukan" })
    }

    res.status(200).json({ data: transactionHeader })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const postTransactionHeader = async (req, res) => {
  try {
    const newTransactionHeaderData = req.body

    const detail = newTransactionHeaderData.Detail
    for (let i of detail) {
      const item = await getItemById(i.item_id)
      if (i.quantity > item.stock) {
        res.send("Quantity tidak boleh melebihi stok")
        throw error()
      }
    }

    const transactionHeader = await insertTransactionHeader(
      newTransactionHeaderData
    )

    const allTransactionDetail = []

    for (let i of detail) {
      const transactiondetail = await insertTransactionDetail(
        i,
        transactionHeader.id
      )

      if (transactionHeader.outlet_id != null) {
        await decreaseStock(i.quantity, i.item_id)
      } else {
        await increaseStock(i.quantity, i.item_id)
      }

      allTransactionDetail.push(transactiondetail)
    }

    res.status(200).json({
      data: {
        ...transactionHeader.dataValues,
        Detail: allTransactionDetail,
      },
      message: "Header transaksi berhasil ditambahkan",
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const updateTransactionHeader = async (req, res) => {
  const transactionHeaderId = req.params.id
  const transactionHeaderData = req.body

  if (!transactionHeaderData) {
    return res.status(400).send("Data harus diisi semua")
  }

  try {
    const transactionHeader = await editTransactionHeaderById(
      transactionHeaderId,
      transactionHeaderData
    )
    if (!transactionHeader) {
      return res.status(400).json({
        message: "Data sudah ada atau Transaction Header tidak ditemukan",
      })
    }

    res.status(200).json({
      data: transactionHeader,
      message: "Transaction Header berhasil diupdate!",
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const removeTransactionHeader = async (req, res) => {
  try {
    const transactionHeaderId = req.params.id

    await deleteTransactionHeaderById(transactionHeaderId)
    res.status(200).json({ message: "Data berhasil dihapus" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  allTransactionHeader,
  transactionHeaderById,
  postTransactionHeader,
  updateTransactionHeader,
  removeTransactionHeader,
}

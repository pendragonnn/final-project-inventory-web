const {
  getAllTransactionDetail,
  getTransactionDetailById,
  insertTransactionDetail,
  editTransactionDetailById,
  deleteTransactionDetailById,
} = require("../service/transaction.detail.service")

const allTransactionDetail = async (req, res) => {
  const page = req.query.page || 1
  const size = req.query.size || 10
  try {
    const { transactionDetails, dataLength } = await getAllTransactionDetail(page, size)
    res.status(200).json({ 
      data: transactionDetails,
      totalItems: transactionDetails.length,
      currentPage: parseInt(page),
      totalPages: Math.ceil(dataLength / size)
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const transactionDetailById = async (req, res) => {
  try {
    const transactionDetailId = req.params.id
    const transactionDetail = await getTransactionDetailById(
      transactionDetailId
    )

    if(!transactionDetail) {
      return res.status(404).json({ message: "Detail transaksi tidak ditemukan"})
    }

    res.status(200).json({ data: transactionDetail });
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const postTransactionDetail = async (req, res) => {
  try {
    const newTransactionDetailData = req.body

    const transactionDetail = await insertTransactionDetail(newTransactionDetailData)

    res.status(200).json({ data: transactionDetail, message: "Detail transaksi berhasil ditambahkan" });
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const updateTransactionDetail = async (req, res) => {
  const transactionDetailId = req.params.id
  const transactionDetailData = req.body

  if(!transactionDetailData) {
    return res.status(400).send("Data harus diisi semua")
  }

  try {
    const transactionDetail = await editTransactionDetailById(
      transactionDetailId,
      transactionDetailData
    )
    if (!transactionDetail) {
      return res
        .status(400)
        .json({ message: "Data sudah ada atau Transaction Detail tidak ditemukan",
      })
    }

    res.status(200).json({
      data: transactionDetail,
      message: "Detail transaksi berhasil diupdate!",
    });
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const removeTransactionDetail = async (req, res) => {
  try {
    const transactionDetailId = req.params.id

    await deleteTransactionDetailById(transactionDetailId)
    res.status(200).json({ message: "Data berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  allTransactionDetail,
  transactionDetailById,
  postTransactionDetail,
  updateTransactionDetail,
  removeTransactionDetail,
}
const {
  getTransactionDetailById,
} = require("../service/transaction.detail.service")

const transactionDetailById = async (req, res) => {
  try {
    const transactionDetailId = req.params.id
    const transactionDetail = await getTransactionDetailById(
      transactionDetailId
    )

    if (!transactionDetail) {
      return res
        .status(404)
        .json({ message: "Detail transaksi tidak ditemukan" })
    }

    res.status(200).json({ data: transactionDetail })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  transactionDetailById,
}

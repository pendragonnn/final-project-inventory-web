const {
  getTransactionDetailById,
  // insertTransactionDetail,
  getAllTransactionDetail,
} = require("../service/transaction.detail.service")

const allTransactionDetail = async (req, res) => {
  const page = req.query.page || 1
  const size = req.query.size || 10
  try {
    const { transactionDetails, dataLength } = await getAllTransactionDetail(
      page,
      size
    )
    res.status(200).json({
      data: transactionDetails,
      totalItems: transactionDetails.length,
      currentPage: parseInt(page),
      totalPages: Math.ceil(dataLength / size),
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

    if (!transactionDetail) {
      return res.status(404).json({ message: "Transaction Detail Not Found" })
    }

    res.status(200).json({ data: transactionDetail })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  transactionDetailById,
  allTransactionDetail,
}

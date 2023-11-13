const {
  getAllTransactionDetail,
  getTransactionDetailById,
} = require("../service/transactiondetail.service")

const allTransactionDetail = async (req, res) => {
  const transactiondetail = await getAllTransactionDetail()
  console.log(transactiondetail)
  res.json(transactiondetail)
}

const transactionDetailById = async (req, res) => {
  try {
    const transactiondetailId = req.params.id
    const transactionheader = await getTransactionDetailById(
      transactiondetailId
    )

    res.send(transactionheader)
  } catch (err) {
    res.status(404).send(err.message)
  }
}

module.exports = { allTransactionDetail, transactionDetailById }

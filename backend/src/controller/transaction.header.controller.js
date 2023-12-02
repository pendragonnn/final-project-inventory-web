const {
  getAllTransactionHeader,
  getTransactionHeaderById,
  getTransactionHeaderReceiving,
  getTransactionHeaderIsuing,
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
      totalPages: Math.ceil(dataLength / (size === "all" ? dataLength : size)), // Adjust totalPages calculation
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const alltransactionReceiving = async (req, res) => {
  const page = req.query.page || 1
  const size = req.query.size || 10

  try {
    const { transactionReceiving, dataLength } =
      await getTransactionHeaderReceiving(page, size)

    res.status(200).json({
      data: transactionReceiving,
      totalItems: dataLength,
      currentPage: parseInt(page),
      totalPages: Math.ceil(dataLength / size),
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const alltransactionIsuing = async (req, res) => {
  const page = req.query.page || 1
  const size = req.query.size || 10

  try {
    const { transactionIsuing, dataLength } = await getTransactionHeaderIsuing(
      page,
      size
    )

    res.status(200).json({
      data: transactionIsuing,
      totalItems: dataLength,
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
      return res.status(404).json({ message: "Transaction Header Not Found" })
    }

    res.status(200).json({ data: transactionHeader })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const postTransactionHeader = async (req, res) => {
  try {
    const newTransactionHeaderData = req.body

    const transactionHeader = await insertTransactionHeader(
      newTransactionHeaderData
    )

    const allTransactionDetail = []

    const detail = newTransactionHeaderData.Detail
    for (let i of detail) {
      const item = await getItemById(i.item_id)
      if (i.quantity > item.stock && transactionHeader.outlet_id != null) {
        return res.send("Quantity must not exceed stock")
      }
    }

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
      message: "Successful Added Transaction Header",
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const updateTransactionHeader = async (req, res) => {
  const transactionHeaderId = req.params.id
  const transactionHeaderData = req.body

  if (!transactionHeaderData) {
    return res.status(400).send("Data Musth Have Value")
  }

  try {
    const transactionHeader = await editTransactionHeaderById(
      transactionHeaderId,
      transactionHeaderData
    )
    if (!transactionHeader) {
      return res.status(400).json({
        message: "Transaction Header Not Found or Already Added",
      })
    }

    res.status(200).json({
      data: transactionHeader,
      message: "Successfull Update Transaction Header!",
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const removeTransactionHeader = async (req, res) => {
  try {
    const transactionHeaderId = req.params.id

    await deleteTransactionHeaderById(transactionHeaderId)
    res.status(200).json({ message: "Successful Delete Transaction Header!" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  allTransactionHeader,
  alltransactionReceiving,
  alltransactionIsuing,
  transactionHeaderById,
  postTransactionHeader,
  updateTransactionHeader,
  removeTransactionHeader,
}

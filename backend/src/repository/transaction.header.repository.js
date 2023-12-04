const models = require("../../models")
const TransactionsHeaders = models.TransactionHeader
const TransactionDetail = models.TransactionDetail
const Item = models.Item
const User = models.User
const Outlet = models.Outlet
const Supplier = models.Supplier
const { Op } = require("sequelize")

const findsTransactionHeader = async (page, size) => {
  const offset = (page - 1) * size
  const transactionHeadersAll = await TransactionsHeaders.findAll()
  const dataLength = transactionHeadersAll.length
  const transactionHeaders = await TransactionsHeaders.findAll({
    offset: offset,
    limit: size,
    attributes: {
      exclude: ["outlet_id"], // Exclude the 'outlet_id' field
    },
    include: [
      {
        model: User,
        attributes: ["full_name"],
      },
      {
        model: Outlet,
        attributes: ["name"],
      },
      {
        model: Supplier,
        attributes: ["name"],
      },
    ],
    where: {
      supplier_id: {
        [Op.ne]: null, // Memastikan supplier_id tidak sama dengan null
      },
    },
  })
  return { transactionHeaders, dataLength }
}

const findsTransactionHeaderReceiving = async (page, size) => {
  const offset = (page - 1) * size

  // Menggunakan count untuk menghitung jumlah data berdasarkan kondisi
  const dataLength = await TransactionsHeaders.count({
    where: {
      supplier_id: {
        [Op.ne]: null,
      },
    },
  })

  const transactionReceiving = await TransactionsHeaders.findAll({
    offset: offset,
    limit: size,
    attributes: {
      exclude: ["outlet_id"],
    },
    include: [
      {
        model: User,
        attributes: ["full_name"],
      },
      {
        model: Outlet,
        attributes: ["name"],
      },
      {
        model: Supplier,
        attributes: ["name"],
      },
    ],
    where: {
      supplier_id: {
        [Op.ne]: null,
      },
    },
  })

  return { transactionReceiving, dataLength }
}

const findsTransactionHeaderIsuing = async (page, size) => {
  const offset = (page - 1) * size

  // Menggunakan count untuk menghitung jumlah data berdasarkan kondisi
  const dataLength = await TransactionsHeaders.count({
    where: {
      outlet_id: {
        [Op.ne]: null,
      },
    },
  })

  const transactionIsuing = await TransactionsHeaders.findAll({
    offset: offset,
    limit: size,
    attributes: {
      exclude: ["supplier_id"],
    },
    include: [
      {
        model: User,
        attributes: ["full_name"],
      },
      {
        model: Outlet,
        attributes: ["name"],
      },
      {
        model: Supplier,
        attributes: ["name"],
      },
    ],
    where: {
      outlet_id: {
        [Op.ne]: null,
      },
    },
  })

  return { transactionIsuing, dataLength }
}

const findTransactionHeadertById = async (id) => {
  const transactionHeader = await TransactionsHeaders.findOne({
    include: [
      {
        model: TransactionDetail,
        include: [
          {
            model: Item,
          },
        ],
      },
    ],
    where: {
      id,
    },
  })
  return transactionHeader
}

function generateNewId(existingIds) {
  const maxNumber = existingIds.reduce((max, id) => {
    const currentNumber = parseInt(id.split("-")[1], 10)
    return currentNumber > max ? currentNumber : max
  }, 0)

  const newNumber = maxNumber + 1
  const newId = `TH-${String(newNumber).padStart(4, "0")}`

  return newId
}

const createTransactionHeader = async (transactionHeaderData) => {
  try {
    const existingIds = await TransactionsHeaders.findAll({
      attributes: ["id"],
    })

    const newId = generateNewId(
      existingIds.map((transactionHeader) => transactionHeader.id)
    )

    const transactionHeader = await TransactionsHeaders.create({
      id: newId,
      user_id: transactionHeaderData.user_id,
      outlet_id: transactionHeaderData.outlet_id,
      supplier_id: transactionHeaderData.supplier_id,
      transaction_date: transactionHeaderData.transaction_date,
      information: transactionHeaderData.information,
    })

    return transactionHeader
  } catch (error) {
    throw error
  }
}

const createTransactionDetail = async (transsactionDetailData, header_id) => {
  try {
    const existingIds = await TransactionDetail.findAll({
      attributes: ["id"],
    })

    const newId = generateNewId(
      existingIds.map((transactionDetail) => transactionDetail.id)
    )

    const transactionDetail = await TransactionDetail.create({
      id: newId,
      header_id: header_id,
      item_id: transsactionDetailData.item_id,
      quantity: transsactionDetailData.quantity,
      price_item: transsactionDetailData.price_item,
    })

    return transactionDetail
  } catch (error) {
    throw error
  }
}

const editTransactionHeader = async (id, transactionHeaderData) => {
  const updatedTransactionHeader = await TransactionsHeaders.update(
    {
      user_id: transactionHeaderData.user_id,
      outlet_id: transactionHeaderData.outlet_id,
      supplier_id: transactionHeaderData.supplier_id,
      transaction_date: transactionHeaderData.transaction_date,
      information: transactionHeaderData.information,
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
  const transactionHeader = await TransactionsHeaders.destroy({
    where: {
      id,
    },
  })
  return transactionHeader
}

module.exports = {
  findsTransactionHeader,
  findTransactionHeadertById,
  findsTransactionHeaderIsuing,
  findsTransactionHeaderReceiving,
  createTransactionHeader,
  editTransactionHeader,
  deleteTransactionHeader,
  createTransactionDetail,
}

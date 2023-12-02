import { instance } from "../axios/index"

async function createTransactionHeader(data) {
  try {
    const res = await instance.post("/transaction-header", data)
    return res.data
  } catch (err) {
    throw new Error(err.response.data)
  }
}

async function getTransactionHeader(page, size) {
  const payload = {
    page: page,
    size: size,
  }

  try {
    const res = await instance.get(`/transaction-header`, {
      params: payload,
    })
    return res.data
  } catch (err) {
    throw new Error(err.response.data)
  }
}

// async function getTransactionHeaderWithOutlet(page, size) {
//   const payload = {
//     page: page,
//     size: size,
//   }

//   try {
//     const res = await instance.get(`/transaction-header`, { params: payload })

//     // // Filter data where outlet_id is not null
//     // const filteredData = res.data.data.filter(
//     //   (transaction) => transaction.outlet_id !== null
//     // )

//     return res.data
//   } catch (err) {
//     throw new Error(err.response.data)
//   }
// }

async function getTransactionHeaderWithSupplier(page, size, supplierId) {
  const payload = {
    page: page,
    size: size,
  }

  try {
    const res = await instance.get(`/transaction-header`, {
      params: payload,
    })

    // Filter data based on outletId
    const filteredData = res.data.filter(
      (transaction) => transaction.supplier_id === supplierId
    )

    return filteredData
  } catch (err) {
    throw new Error(err.response.data)
  }
}

async function getTransactionHeaderById(id) {
  try {
    const res = await instance(`/transaction-header/${id}`)
    return res.data
  } catch (err) {
    console.log(err)
  }
}

async function getTransactionDetailById(id) {
  try {
    const res = await instance(`/transaction-detail/${id}`)
    return res.data
  } catch (err) {
    throw new Error(err.response.data)
  }
}

async function deleteTransactionHeader(id) {
  try {
    const res = await instance.delete(`/transaction-header/${id}`)
    return res.data
  } catch (err) {
    console.log(err)
  }
}

module.exports = {
  createTransactionHeader,
  getTransactionHeader,
  getTransactionHeaderById,
  getTransactionDetailById,
  deleteTransactionHeader,
  // getTransactionHeaderWithOutlet,
  getTransactionHeaderWithSupplier,
}

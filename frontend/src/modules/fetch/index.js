import { instance } from "../axios/index"

async function createTransactionHeader(data) {
  try {
    const res = await instance.post("/transaction-header", data)
    return res.data
  } catch (err) {
    throw new Error(err.response.data)
  }
}

async function getTransactionHeader() {
  try {
    const res = await instance.get(`/transaction-header`)
    return res.data
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

module.exports = {
  createTransactionHeader,
  getTransactionHeader,
  getTransactionHeaderById,
  getTransactionDetailById,
}

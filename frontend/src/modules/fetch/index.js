import { instance } from "../axios/index";

async function createTransactionHeader(data) {
  try {
    const res = await instance.post("/transaction-header", data);
    return res.data;
  } catch (err) {
    throw new Error(err.response.data);
  }
}

async function getTransactionHeader() {
  try {
    const res = await instance.get(`/transaction-header`);
    return res.data;
  } catch (err) {
    throw new Error(err.response.data);
  }
}

async function getTransactionHeaderById(id) {
  try {
    const res = await instance(`/transaction-header/${id}`);
    return res.data;
  } catch (err) {
    console.log(err);
  }
}

// item
async function getItem() {
  try {
    const res = await instance.get(`/item`);
    return res.data;
  } catch (err) {
    throw new Error(err.response.data);
  }
}

// outlet
async function getOutlet() {
  try {
    const res = await instance.get(`/outlet`);
    return res.data;
  } catch (err) {
    throw new Error(err.response.data);
  }
}

// user
async function getUser() {
  try {
    const res = await instance.get(`/user`);
    return res.data;
  } catch (err) {
    throw new Error(err.response.data);
  }
}

module.exports = {
  createTransactionHeader,
  getTransactionHeader,
  getTransactionHeaderById,
  getItem,
  getOutlet,
  getUser,
};

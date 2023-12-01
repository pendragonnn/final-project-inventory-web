import axios from "axios";
import Cookies from "js-cookie";

const token = Cookies.get("token");
const headers = {
  "content-type": "application/json; charset=utf=UTF-8",
  Authorization: `Bearer ${token}`,
};

const getSupplier = async (page, size) => {
  const result = await axios.get("http://localhost:8000/api/v1/supplier", {
    headers: headers,
    params: {
      page: page,
      size: size,
    },
  });

  return result;
};

const getSupplierByid = async (id) => {
  const result = await axios.get(
    `http://localhost:8000/api/v1/supplier/${id}`,
    {
      headers: headers,
    }
  );

  return result;
};

const addSupplier = async (data) => {
  const result = await axios.post(
    "http://localhost:8000/api/v1/supplier",
    data,
    {
      headers: headers,
    }
  );

  return result;
};

const updateSupplier = async (id, data) => {
  const result = await axios.put(
    `http://localhost:8000/api/v1/supplier/${id}`,
    data,
    {
      headers: headers,
    }
  );

  return result;
};

const deleteSupplier = async (id) => {
  const result = await axios.delete(
    `http://localhost:8000/api/v1/supplier/${id}`,
    {
      headers: headers,
    }
  );

  return result;
};

export default {
  addSupplier,
  getSupplier,
  getSupplierByid,
  updateSupplier,
  deleteSupplier,
};

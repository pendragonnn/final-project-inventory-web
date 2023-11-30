import axios from "axios";
import Cookies from "js-cookie";

const token = Cookies.get("token");
const headers = {
  "content-type": "application/json; charset=utf=UTF-8",
  Authorization: `Bearer ${token}`,
};

const getCategory = async (page = null, size = 100) => {
  const result = await axios.get("http://localhost:8000/api/v1/category", {
    headers: headers,
    params: {
      page: page,
      size: size
    }
  });

  return result;
};

const getCategoryByid = async (id) => {
  const result = await axios.get(
    `http://localhost:8000/api/v1/category/${id}`,
    {
      headers: headers,
    }
  );

  return result;
};

const addCategory = async (data) => {
  const result = await axios.post(
    "http://localhost:8000/api/v1/category",
    data,
    {
      headers: headers,
    }
  );

  return result;
};

const updateCategory = async (id, data) => {
  const result = await axios.put(
    `http://localhost:8000/api/v1/category/${id}`,
    data,
    {
      headers: headers,
    }
  );

  return result;
};

const deleteCategory = async (id) => {
  const result = await axios.delete(
    `http://localhost:8000/api/v1/category/${id}`,
    {
      headers: headers,
    }
  );

  return result;
};

export default {
  addCategory,
  getCategory,
  getCategoryByid,
  updateCategory,
  deleteCategory,
};

import axios from "axios";
import Cookies from "js-cookie";

const token = Cookies.get("token");
const headers = {
  "content-type": "application/json; charset=utf=UTF-8",
  Authorization: `Bearer ${token}`,
};

const getItem = async () => {
  const result = await axios.get("http://localhost:8000/api/v1/item", {
    headers: headers,
  });

  return result;
};

const getItemByid = async (id) => {
  const result = await axios.get(`http://localhost:8000/api/v1/item/${id}`, {
    headers: headers,
  });

  return result;
};

const addItem = async (data) => {
  const result = await axios.post("http://localhost:8000/api/v1/item", data, {
    headers: headers,
  });

  return result;
};

const updateItem = async (id, data) => {
  const result = await axios.put(`http://localhost:8000/api/v1/item/${id}`, data, {
    headers: headers,
  });

  return result;
};

const deleteItem = async (id) => {
  const result = await axios.delete(`http://localhost:8000/api/v1/item/${id}`, {
    headers: headers,
  });

  return result;
};


const uploadItem = async (id)=>{
  const result = await axios.post(`http://localhost:8000/api/v1/item/upload/${id}`, {
    headers: headers,
  });
  return result;
}

export default {
  addItem,
  getItem,
  getItemByid,
  updateItem,
  deleteItem,
  uploadItem,
};

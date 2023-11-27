import axios from "axios";
import Cookies from "js-cookie";

const token = Cookies.get("token");
const headers = {
  "content-type": "application/json; charset=utf=UTF-8",
  Authorization: `Bearer ${token}`,
};

const getOutlet = async () => {
  const result = await axios.get("http://localhost:8000/outlet", {
    headers: headers,
  });

  return result;
};

const getOutletByid = async (id) => {
  const result = await axios.get(`http://localhost:8000/outlet/${id}`, {
    headers: headers,
  });

  return result;
};

const addOutlet = async (data) => {
  const result = await axios.post("http://localhost:8000/outlet", data, {
    headers: headers,
  });

  return result;
};

const updateOutlet = async (id, data) => {
  let updatedFields = {};

  // Cek setiap field yang ada pada objek data dan tambahkan ke updatedFields jika berbeda
  if (data.hasOwnProperty("name")) {
    updatedFields.name = data.name;
  }

  if (data.hasOwnProperty("address")) {
    updatedFields.address = data.address;
  }

  if (data.hasOwnProperty("phone")) {
    updatedFields.phone = data.phone;
  }

  const result = await axios.put(
    `http://localhost:8000/outlet/${id}`,
    updatedFields,
    {
      headers: headers,
    }
  );

  return result;
};

const deleteOutlet = async (id) => {
  const result = await axios.delete(`http://localhost:8000/outlet/${id}`, {
    headers: headers,
  });

  return result;
};

export default {
  addOutlet,
  getOutlet,
  getOutletByid,
  updateOutlet,
  deleteOutlet,
};

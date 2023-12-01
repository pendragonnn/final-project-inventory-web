import axios from "axios";
import Cookies from "js-cookie";

const token = Cookies.get("token");
const headers = {
  "content-type": "application/json; charset=utf=UTF-8",
  Authorization: `Bearer ${token}`,
};

const getOutlet = async (page, size) => {
  const result = await axios.get("http://localhost:8000/api/v1/outlet", {
    headers: headers,
    params: {
      page: page,
      size: size,
    },
  });

  return result;
};

const getOutletByid = async (id) => {
  const result = await axios.get(`http://localhost:8000/api/v1/outlet/${id}`, {
    headers: headers,
  });

  return result;
};

const addOutlet = async (data) => {
  const result = await axios.post("http://localhost:8000/api/v1/outlet", data, {
    headers: headers,
  });

  return result;
};

const updateOutlet = async (id, data) => {
  const result = await axios.put(
    `http://localhost:8000/api/v1/outlet/${id}`,
    data,
    {
      headers: headers,
    }
  );

  return result;
};

const deleteOutlet = async (id) => {
  const result = await axios.delete(
    `http://localhost:8000/api/v1/outlet/${id}`,
    {
      headers: headers,
    }
  );

  return result;
};

export default {
  addOutlet,
  getOutlet,
  getOutletByid,
  updateOutlet,
  deleteOutlet,
};

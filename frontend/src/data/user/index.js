// user.js
import axios from "axios";
import Cookies from "js-cookie";

const token = Cookies.get("token");
const headers = {
  "content-type": "application/json; charset=utf=UTF-8",
  Authorization: `Bearer ${token}`,
};

const getUsers = async () => {
  const result = await axios.get("http://localhost:8000/user");
  return result;
};

const getUserById = async (id) => {
  const result = await axios.get(`http://localhost:8000/user/${id}`);
  return result;
};

const addUser = async (data) => {
  const result = await axios.post("http://localhost:8000/user", data, {
    headers: headers,
  });
  return result;
};

const updateUser = async (id, data) => {
  const result = await axios.put(`http://localhost:8000/user/${id}`, data, {
    headers: headers,
  });
  return result;
};

const deleteUser = async (id) => {
  const result = await axios.delete(`http://localhost:8000/user/${id}`, {
    headers: headers,
  });
  return result;
};

const uploadImage = async (userId, formData) => {
    const result = await axios.post(
      `http://localhost:8000/user/upload/${userId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return result;
  };

export default {
  addUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  uploadImage,
};

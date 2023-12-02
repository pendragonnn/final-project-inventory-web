import axios from "axios";
import Cookies from "js-cookie";

const token = Cookies.get("token");
const headers = {
  "content-type": "application/json; charset=utf=UTF-8",
  Authorization: `Bearer ${token}`,
};

const register = async (data) => {
  const result = await axios.post(
    "http://localhost:8000/api/v1/register",
    data
  );

  return result;
};

const login = async (data) => {
  const result = await axios.post("http://localhost:8000/api/v1/login", data);

  return result;
};

const logout = async () => {
  const result = await axios.delete("http://localhost:8000/api/v1/logout", {
    headers: headers,
  });

  return result;
};

const verifyEmail = async (data) => {
  const result = await axios.post("http://localhost:8000/api/v1/verify", data);

  return result;
};

const resetPassword = async (data) => {
  const result = await axios.post("http://localhost:8000/api/v1/reset", data);

  return result;
};

export default {
  register,
  login,
  logout,
  verifyEmail,
  resetPassword,
};

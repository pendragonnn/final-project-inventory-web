import axios from "axios";
import Cookies from "js-cookie";

const token = Cookies.get("token");
const headers = {
  "content-type": "application/json; charset=utf=UTF-8",
  Authorization: `Bearer ${token}`,
};

const getUsers = async (page = null, size = 100) => {
  const result = await axios.get("http://localhost:8000/api/v1/user", {
    headers: headers,
    params: {
      page: page,
      size: size
    }
  });
  return result;
};

const getUserById = async (id) => {
  const result = await axios.get(`http://localhost:8000/api/v1/user/${id}`, {
    headers: headers,
  });
  return result;
};

const addUser = async (data) => {
  const result = await axios.post("http://localhost:8000/api/v1/user", data, {
    headers: headers,
  });
  return result;
};

const updateUser = async (id, data) => {
  const result = await axios.put(
    `http://localhost:8000/api/v1/user/${id}`,
    data,
    {
      headers: headers,
    }
  );
  return result;
};

const deleteUser = async (id) => {
  const result = await axios.delete(`http://localhost:8000/api/v1/user/${id}`, {
    headers: headers,
  });
  return result;
};

const uploadImage = async (Id, formData) => {
  const imageResponse = await axios.post(
    `http://localhost:8000/api/v1/user/upload/${Id}`,
    formData,
    {
      headers: {
        ...headers,
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return imageResponse;
};

const addUser2 = async () => {
  try {
    const userWithoutImage = {
      role_id: e.target.role_id.value,
      full_name: e.target.full_name.value,
      email: e.target.email.value,
      password: e.target.password.value,
    };

    const result = await axios.post(
      "http://localhost:8000/api/v1/user",
      userWithoutImage,
      {
        headers: headers,
      }
    );

    return result;
  } catch (error) {
    console.error("Error:", error.message);
    throw error; // Re-throw the error to propagate it further if needed
  }
};

function getUserImageUrl(imageUrl) {
  return {
    src: `http://localhost:8000/api/v1/user/upload/${imageUrl}`,
    headers: headers,
  };
}

const getUserById1 = async (image_url) => {
  const result = await axios.get(
    `http://localhost:8000/api/v1/user/${image_url}`,
    {
      headers: headers,
    }
  );
  return result;
};

const getUserImageUrl2 = async (imageUrl) => {
  const img = await axios.get(
    `http://localhost:8000/api/v1/user/upload/${imageUrl}`,
    {
      headers: headers,
    }
  );
  return {
    src: img,
  };
};

const updatePassword = async (id, data) => {
  const result = await axios.post(
    `http://localhost:8000/api/v1/user/${id}`,
    data,
    {
      headers: headers,
    }
  );
  return result;
};

// function getUserImageUrl(imageUrl) {
//   const token = Cookies.get("token");
//   const headers = {
//     "content-type": "application/json; charset=utf=UTF-8",
//     Authorization: `Bearer ${token}`,
//   };

//   return {
//     src: `http://localhost:8000/user/upload/${imageUrl}`,
//     headers: headers,
//   };
// }

export default {
  addUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  uploadImage,
  addUser2,
  getUserImageUrl,
  getUserById1,
  getUserImageUrl2,
  updatePassword,
};

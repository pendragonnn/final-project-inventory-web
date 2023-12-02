import axios from "axios";
import Cookies from "js-cookie";

const token = Cookies.get("token");
const headers = {
  "content-type": "application/json; charset=utf=UTF-8",
  Authorization: `Bearer ${token}`,
};

const getItem = async (page, size) => {
  const result = await axios.get("http://localhost:8000/api/v1/item", {
    headers: headers,
    params: {
      page: page,
      size: size
    }
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
  const result = await axios.put(
    `http://localhost:8000/api/v1/item/${id}`,
    data,
    {
      headers: headers,
    }
  );

  return result;
};

const deleteItem = async (id, data) => {
  const result = await axios.delete(`http://localhost:8000/api/v1/item/${id}`,

  {
    headers: headers,
  }
  );

  return result;
};

const uploadItem = async (id, formData) => {
  const result = await axios.post(
    `http://localhost:8000/api/v1/item/upload/${id}`,
    formData,
    {
      headers: {
        ...headers,
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return result;
};

function getItemImageUrl(imageUrl) {
  return {
    src: `http://localhost:8000/api/v1/item/upload/${imageUrl}`,
    headers: headers,
  };
}


const addItem2 = async () => {
  try {
    const itemWithoutImage = {
      name: e.target.name.value,
      description: e.target.description.value,
      category_id: e.target.category_id.value,
      price: e.target.price.value,
      stock: e.target.stock.value,
    };

    const result = await axios.post(
      "http://localhost:8000/api/v1/item",
      itemWithoutImage,
      {
        headers: headers,
      }
    );

    return result;
  } catch (error) {
    console.error("Error:", error.message);
    throw error; 
  }
};

export default {
  addItem,
  getItem,
  getItemByid,
  updateItem,
  deleteItem,
  uploadItem,
  addItem2,
  getItemImageUrl
};

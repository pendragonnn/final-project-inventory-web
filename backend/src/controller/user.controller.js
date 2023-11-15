const {
  getAllUsers,
  getUserById,
  insertUser,
  editUserById,
  deleteUserById,
  updateUserPhoto,
} = require("../service/user.service");
const fs = require("fs");

const allUsers = async (req, res) => {
  const page = req.query.page || 1
  const size = req.query.size || 10
  try {
    const { users, dataLength } = await getAllUsers(page, size);
    res.status(200).json({ 
      data: users,
      totalItems: users.length,
      currentPage: parseInt(page),
      totalPages: Math.ceil(dataLength / size)
    })
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const userById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await getUserById(userId);

    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }
    res.status(200).json({ data: user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const postUser = async (req, res) => {
  try {
    const newUserData = req.body;

    const user = await insertUser(newUserData);

    res.status(200).json({ data: user, message: "User berhasil ditambahkan" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  const id = req.params.id;
  const userData = req.body;

  if(!userData) {
    return res.status(400).json({ message: "Data harus diisi semua" })
  }

  try {
  const user = await editUserById(id, userData);

  if (!user) {
    return res
      .status(400)
      .json({ message: "Data sudah ada atau User tidak ditemukan" });
  }
  
  res.status(200).json({ 
    data: user, 
    message: " User berhasil diupdate!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const removeUser = async (req, res) => {
  try {
    const userId = req.params.id;

    await deleteUserById(userId);

    res.status(200).json({ message: "Data berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const uploadUserPhoto = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await getUserById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const image_url = req.file.path;

    const updatedUser = await updateUserPhoto(id, image_url);

    res
      .status(200)
      .json({ message: "User photo updated successfully", data: updatedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  allUsers,
  userById,
  postUser,
  updateUser,
  removeUser,
  uploadUserPhoto,
};

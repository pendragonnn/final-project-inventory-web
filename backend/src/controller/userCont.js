const usersevice = require("../service/userservice");
const fs = require("fs");

const getAllUser = async (req, res) => {
  try {
    const users = await usersevice.getAllUser();
    res.status(200).json({ data: users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await usersevice.getUserById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ data: user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createNewUser = async (req, res) => {
  try {
    const userData = req.body;
    await usersevice.createNewUser(userData);
    res.status(200).json({ message: "New user created" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUserById = async (req, res) => {
  try {
    const id = req.params.id;
    const userData = req.body;
    const updateduser = await usersevice.updateUserById(id, userData);

    if (!updateduser) {
      return res.status(404).json({ message: " User not found " });
    }
    res.status(200).json({ message: " user update succesfully " });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUserById = async (req, res) => {
  try {
    const id = req.params.id;
    const deleteduser = await usersevice.deleteUserById(id);
    if (!deleteduser) {
      return res.status(404).json({ message: " User not found" });
    }
    res.status(200).json({ message: " User deleted succesfully " });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const uploadUserPhoto = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await usersevice.getUserById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const image_url = req.file.path;

    fs.unlinkSync(req.file.path);

    const updatedUser = await usersevice.updateUserPhoto(id, image_url);

    res
      .status(200)
      .json({ message: "User photo updated successfully", data: updatedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllUser,
  getUserById,
  createNewUser,
  updateUserById,
  deleteUserById,
  uploadUserPhoto,
};

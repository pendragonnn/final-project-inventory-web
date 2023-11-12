const userRepo = require("../repository/userRepo");

const getAllUser = async () => {
  return await userRepo.getAllUser()
};

const getUserById = async (id) => {
  return await userRepo.getUserById(id);
};

const createNewUser = async (userData) => {
  return await userRepo.createNewUser(userData);
};

const updateUserById = async (id, userData) => {
  return await userRepo.updateUserById(id, userData);
};

const deleteUserById = async (id) => {
  return await userRepo.deleteUserById(id);
};

const updateUserPhoto = async (id, image_url) => {
  try {
    return await userRepo.updateUserPhoto(id, image_url);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getAllUser,
  getUserById,
  createNewUser,
  updateUserById,
  deleteUserById,
  updateUserPhoto,
};

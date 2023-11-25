const User = require("../repository/user.repository");

const getAllUser = async () => {
  return await User.getAllUser();
};

const getUserById = async (id) => {
  return await User.getUserById(id);
};


const createNewUser = async (userData) => {
  const userEmail = await User.findUserByEmail(userData.email);

  if (userEmail) {
    throw new Error("Email sudah Terdaftar");
  }
 
  const user = await User.insertUser(userEmail);

  return user;
};

const updateUserById = async (id, userData) => {
  return await User.updateUserById(id, userData);
};

const deleteUserById = async (id) => {
  return await User.deleteUserById(id);
};

const updateUserPhoto = async (id, image_url) => {
  try {
    return await User.updateUserPhoto(id, image_url);
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

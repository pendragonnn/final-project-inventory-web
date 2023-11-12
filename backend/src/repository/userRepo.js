const models = require("../../models");
const User = models.User;

const getAllUser = async (req, res) => {
  return await User.findAll();
};

const getUserById = async (id) => {
  return await User.findByPk(id)
};

const createNewUser = async (userData) => {
  return await User.create(userData);
};

const updateUserById = async (id, userData) => {
  const user = await User.findByPk(id);

  if (!user) {
    return null;
  }
  await User.update(userData, { where: { id } });
  return user;
};

const deleteUserById = async (id) => {
  const user = await User.findByPk(id);

  if (!user) {
    return null;
  }
  await User.destroy({ where: { id } });
  return user;
};

const updateUserPhoto = async (id, image_url) => {
  try {
    const updatedUser = await User.update(
      { image_url: image_url },
      { where: { id }, returning: true }
    );

    if (updatedUser[0] === 0) return null;

    return updatedUser[1][0].dataValues;
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

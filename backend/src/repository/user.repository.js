const models = require("../../models");
const User = models.User;

const getAllUser = async (req, res) => {
  return await User.findAll();
};

const findUserByEmail = async (email) => {
  const user = await User.findOne({
    where: {
      email,
    },
  });

  return user;
};

const insertUser = async (userData) => {
  try {
    const existingIds = await User.findAll({ attributes: ["id"] });

    const newId = generateNewId(existingIds.map((user) => user.id));

    const user = await User.create({
      id: newId,
      role_id: userData.role_id,
      full_name: userData.full_name,
      username: userData.username,
      email: userData.email,
      password: userData.password,
      image_url: userData.image_url,
    });

    return user;
  } catch (error) {
    console.error("Gagal membuat user", error);
    throw error;
  }
};

function generateNewId(existingIds) {
  const maxNumber = existingIds.reduce((max, id) => {
    const currentNumber = parseInt(id.split("-")[1], 10);
    return currentNumber > max ? currentNumber : max;
  }, 0);

  const newNumber = maxNumber + 1;
  const newId = `O-${String(newNumber).padStart(4, "0")}`;

  return newId;
}

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
  findUserByEmail,
  insertUser,
  updateUserById,
  deleteUserById,
  updateUserPhoto,
};

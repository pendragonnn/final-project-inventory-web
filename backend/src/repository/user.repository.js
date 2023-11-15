const models = require("../../models");
const User = models.User;

const findUsers = async(page, size) => {
  const offset = (page-1) * size
  const usersAll = await User.findAll()
  const dataLength = usersAll.length
  const users = await User.findAll({
    offset: offset,
    limit: size
  })
  return { users, dataLength }
}

const findUserById = async(id) => {
  const user = await User.findOne({
    where: {
      id,
    }
  })

  return user
}

const findUserByEmail = async(email) => {
  const user = await User.findOne({
    where: {
      email,
    }
  })

  return user
}

const createUser = async(userData) => {
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
    throw(error)
  }
}

function generateNewId(existingIds) {
  const maxNumber = existingIds.reduce((max, id) => {
    const currentNumber = parseInt(id.split("-")[1], 10);
    return currentNumber > max ? currentNumber : max;
  }, 0);

  const newNumber = maxNumber + 1;
  const newId = `U-${String(newNumber).padStart(4, "0")}`;

  return newId;
}

const editUser = async(id, userData) => {
  const updatedUser = await User.update(
    {
      role_id: userData.role_id,
      full_name: userData.full_name,
      email: userData.email,
      username: userData.username,
      password: userData.password,
      image_url: userData. image_url
    },
    {
      where: {id},
      returning: true 
    },
  )

  return updatedUser
}

const deleteUser = async(id) => {
  const user = await User.destroy({
    where: {
      id,
    }
  })
  return user
}

const updateUserPhotos = async (id, image_url) => {
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
  findUsers,
  findUserById,
  findUserByEmail,
  createUser,
  editUser,
  deleteUser,
  updateUserPhotos,
};

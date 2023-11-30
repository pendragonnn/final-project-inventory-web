const models = require("../../models");
const User = models.User;
const Role = models.Role;
const bcrypt = require("bcrypt");

const generateNewId = (existingIds) => {
  const maxNumber = existingIds.reduce((max, id) => {
    const currentNumber = parseInt(id.split("-")[1], 10);
    return currentNumber > max ? currentNumber : max;
  }, 0);

  const newNumber = maxNumber + 1;
  const newId = `U-${String(newNumber).padStart(4, "0")}`;

  return newId;
};

const createUser = async (userData, hashedPassword) => {
  try {
    const existingIds = await User.findAll({ attributes: ["id"] });

    const newId = generateNewId(existingIds.map((user) => user.id));

    const user = await User.create({
      id: newId,
      role_id: "1",
      full_name: userData.full_name,
      // username: userData.username,
      email: userData.email,
      password: hashedPassword,
      image_url: userData.image_url,
    });

    return user;
  } catch (error) {
    console.error("User create failed !", error);
    throw error;
  }
};

const editUser = async (id, userData) => {
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const updatedUser = await User.update(
    {
      role_id: userData.role_id,
      full_name: userData.full_name,
      email: userData.email,
      password: hashedPassword,
      image_url: userData.image_url,
    },
    {
      where: { id },
      returning: true,
    }
  );

  return updatedUser;
};

const findUserWithRole = async () => {
  const user = await User.findAll({
    include: [
      {
        model: Role,
        attributes: ["name"],
      },
    ],
  });

  return user;
};

const findUserByEmail = async (email) => {
  const user = await User.findOne({
    where: {
      email,
    },
  });

  return user;
};

const findUserById = async (id) => {
  const user = await User.findOne({
    where: {
      id,
    },
  });

  return user;
};

module.exports = {
  createUser,
  editUser,
  findUserWithRole,
  findUserByEmail,
  findUserById,
};

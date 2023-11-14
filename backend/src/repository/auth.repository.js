const models = require("../../models");
const User = models.User;

const generateNewId = (existingIds) => {
  const maxNumber = existingIds.reduce((max, id) => {
    const currentNumber = parseInt(id.split("-")[1], 10);
    return currentNumber > max ? currentNumber : max;
  }, 0);

  const newNumber = maxNumber + 1;
  const newId = `O-${String(newNumber).padStart(4, "0")}`;

  return newId;
};

const createUser = async (userData, hashedPassword) => {
  try {
    const existingIds = await User.findAll({ attributes: ["id"] });

    const newId = generateNewId(existingIds.map((user) => user.id));

    const user = await User.create({
      id: newId,
      role_id: "R-0001",
      full_name: userData.full_name,
      username: userData.username,
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

const findUserByEmail = async (email) => {
  const user = await User.findOne({
    where: {
      email,
    },
  });

  return user;
};

module.exports = { createUser, findUserByEmail };

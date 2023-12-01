const models = require("../../models");
const User = models.User;
const bcrypt = require("bcrypt");
const { findUserWithRole } = require("./auth.repository");
const Role = models.Role;

const findUsers = async (page, size) => {
  const offset = (page - 1) * size;
  const usersAll = await User.findAll({
    include: [
      {
        model: Role,
        attributes: ["name"],
      },
    ],
  });
  const dataLength = usersAll.length;
  const users = await User.findAll({
    include: [
      {
        model: Role,
        attributes: ["name"],
      },
    ],

    offset: offset,
    limit: size,
    order: [
      ['id', 'DESC'],
    ],
  });
  return { users, dataLength };
};

const findUserById = async (id) => {
  const user = await User.findOne({
    where: {
      id,
    },
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

const createUser = async (userData) => {
  try {
    const existingIds = await User.findAll({ attributes: ["id"] });
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newId = generateNewId(existingIds.map((user) => user.id));

    const user = await User.create({
      id: newId,
      role_id: userData.role_id,
      full_name: userData.full_name,
      email: userData.email,
      password: hashedPassword,
      image_url: userData.image_url,
    });

    return user;
  } catch (error) {
    throw error;
  }
};

function generateNewId(existingIds) {
  const maxNumber = existingIds.reduce((max, id) => {
    const currentNumber = parseInt(id.split("-")[1], 10);
    return currentNumber > max ? currentNumber : max;
  }, 0);

  const newNumber = maxNumber + 1;
  const newId = `U-${String(newNumber).padStart(4, "0")}`;

  return newId;
}

const editUser = async (id, updatedFields) => {
  try {
    const { role_id, full_name, email, password: newPassword, image_url } = updatedFields;

    // Find the user by primary key
    const user = await User.findByPk(id);

    if (!user) {
      throw new Error("User not found");
    }

    const updatedData = {};

    if (role_id !== undefined) {
      updatedData.role_id = role_id;
    }

    if (full_name !== undefined) {
      updatedData.full_name = full_name;
    }

    if (email !== undefined && email !== user.email) {
      updatedData.email = email;
    }

    // Check if the password is provided and not equal to the current password
    if (newPassword !== undefined && newPassword !== user.password) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      updatedData.password = hashedPassword;
    }

    if (image_url !== undefined) {
      updatedData.image_url = image_url;
    }

    if (Object.keys(updatedData).length === 0) {
      // No changes to update
      return user;
    }

    // Update the user with the new data
    const [, [updatedUser]] = await User.update(updatedData, {
      where: {
        id: id,
      },
      returning: true,
    });

    return updatedUser;
  } catch (error) {
    console.error("Edit user error:", error.message);
    throw new Error("Failed to edit user");
  }
};


  // (
  //   {
  //     role_id: userData.role_id,
  //     full_name: userData.full_name,
  //     email: userData.email,
  //     password: hashedPassword,
  //     image_url: userData.image_url,
  //   },
  //   {
  //     where: { id },
  //     returning: true,
  //   }
  // );

//   return updatedUsers[1][0];
// };

const deleteUser = async (id) => {
  const user = await User.destroy({
    where: {
      id,
    },
  });
  return user;
};

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

const editUserPassword = async (id, userData) => {
  console.log(userData);
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

// const findUserWithRole = async () => {
//   const user = await User.findAll({
//     include: [
//       {
//         model: Role,
//         attributes: ["name"],
//       },
//     ],
//   });

//   return user;
// };

module.exports = {
  findUsers,
  findUserById,
  findUserByEmail,
  createUser,
  editUser,
  deleteUser,
  updateUserPhotos,
  editUserPassword,
  // findUserWithRole,
};

const {
  findUsers,
  findUserById,
  findUserByEmail,
  createUser,
  editUser,
  deleteUser,
  updateUserPhotos,
  editUserPassword,
} = require("../repository/user.repository");
const bcrypt = require("bcrypt");

const getAllUsers = async (page, size) => {
  const users = await findUsers(page, size);
  return users;
};

const getUserById = async (id) => {
  try {
    const user = await findUserById(id);

    if (!user) {
      throw new Error("User Not Found");
    }

    if (!user.dataValues || !user.dataValues.password) {
      throw new Error("User data or password is undefined");
    }

    return user;
  } catch (error) {
    throw error;
  }
};

const insertUser = async (userData) => {
  const userEmail = await findUserByEmail(userData.email);

  if (userEmail) {
    throw new Error("User Email Already Added");
  }

  const user = await createUser(userData);

  return user;
};

const editUserById = async (id, newUser) => {
  // try {
  //   const existingUser = await findUserByEmail(newUser.email);

  //   if (existingUser && existingUser.id !== id) {
  //     throw new Error("User Email Already Added");
  //   }

  //   const userToUpdate = await findUserById(id);

  //   if (!userToUpdate) {
  //     throw new Error("User Not Found");
  //   }

  //   const user = await editUser(id, newUser);
  //   return user;
  // } catch (err) {
  //   throw err; // Lebih baik lemparkan kembali kesalahan untuk ditangani oleh pemanggil fungsi.
  // }
  try {
    const existingUser = await getUserById(id);

    if (!existingUser) {
      throw new Error("User Not Found");
    }

    const userEmail = await findUserByEmail(newUser.email);

    if (userEmail && userEmail.id !== id) {
      throw new Error("Email Already Add");
    }

    const updatedUser = await editUser(id, newUser);
    return updatedUser;
  } catch (err) {
    throw new Error(err.message);
  }
};

const deleteUserById = async (id) => {
  try {
    await getUserById(id);

    await deleteUser(id);
  } catch (err) {
    throw err;
  }
};

const updateUserPhoto = async (id, image_url) => {
  try {
    return await updateUserPhotos(id, image_url);
  } catch (error) {
    throw error;
  }
};

const updateUserPassword = async (id, data) => {
  try {
    const getData = await getUserById(id);
    if (!getData) {
      const error = new Error("Invalid username or password");
      error.status = 400;
      throw error;
    }

    const isPasswordMatch = await bcrypt.compare(
      data.current_pass,
      getData.password
    );

    if (!isPasswordMatch) {
      const error = new Error("Invalid password");
      error.status = 400;
      throw error;
    }
    const result = await editUserPassword(id, {
      role_id: getData.role_id,
      full_name: getData.full_name,
      email: getData.email,
      password: data.new_pass,
      image_url: getData.image_url,
    });

    return result;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  insertUser,
  editUserById,
  deleteUserById,
  updateUserPhoto,
  updateUserPassword,
};

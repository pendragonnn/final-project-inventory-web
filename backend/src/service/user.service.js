const {
  findUsers,
  findUserById,
  findUserByEmail,
  createUser,
  editUser,
  deleteUser,
  updateUserPhotos,
} = require("../repository/user.repository");

const getAllUsers = async (page, size) => {
  const users = await findUsers(page, size)
  return users
};

const getUserById = async (id) => {
  const user = await findUserById(id);

  if(!user) {
    throw Error("User Not Found")
  }
  return user 
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
  try {
    const existingUser = await findUserByEmail(newUser.email);

    if (existingUser && existingUser.id !== id) {
      throw new Error("User Email Already Added");
    }

    const userToUpdate = await findUserById(id);

    if (!userToUpdate) {
      throw new Error("User Not Found");
    }

    const user = await editUser(id, newUser);
    return user;
  } catch (err) {
    throw err; // Lebih baik lemparkan kembali kesalahan untuk ditangani oleh pemanggil fungsi.
  }
};

const deleteUserById = async (id) => {
  try {
    await getUserById(id)

    await deleteUser(id)
  } catch (err) {
    throw err
  }
};

const updateUserPhoto = async (id, image_url) => {
  try {
    return await updateUserPhotos(id, image_url);
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
};

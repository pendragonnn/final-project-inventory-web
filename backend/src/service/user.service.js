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
    throw Error("User tidak ditemukan")
  }
  return user 
};


const insertUser = async (userData) => {
  const userEmail = await findUserByEmail(userData.email);

  if (userEmail) {
    throw new Error("Email sudah Terdaftar");
  }
 
  const user = await createUser(userData);

  return user;
};

const editUserById = async (id, newUser) => {
  try {
    const userEmail = await findUserByEmail(newUser.email)
    
    if(userEmail) {
      throw new Error("Email sudah terdaftar")
    }
    
    await findUserById(id)
    
    const user = await editUser(id, newUser);
    return user
  } catch (err) {
    return null
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

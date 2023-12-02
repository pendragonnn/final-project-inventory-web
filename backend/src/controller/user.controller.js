const {
  getAllUsers,
  getUserById,
  insertUser,
  editUserById,
  deleteUserById,
  updateUserPhoto,
  updateUserPassword,
} = require("../service/user.service")
const fs = require("fs")
const path = require("path")

const allUsers = async (req, res) => {
  const page = req.query.page || 1
  const size = req.query.size || 10
  try {
    const { users, dataLength } = await getAllUsers(page, size)
    res.status(200).json({
      data: users,
      totalItems: dataLength,
      currentPage: parseInt(page),
      totalPages: Math.ceil(dataLength / size),
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const userById = async (req, res) => {
  try {
    const userId = req.params.id
    const user = await getUserById(userId)

    if (!user) {
      return res.status(404).json({ message: "User Not Found" })
    }
    res.status(200).json({ data: user })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const postUser = async (req, res) => {
  try {
    const newUserData = req.body

    const user = await insertUser(newUserData)

    res.status(200).json({ data: user, message: "Successful Adding User" })
  } catch (error) {
    res.status(500).json({ message: "User Email Already Added" })
  }
}

const updateUser = async (req, res) => {
  const id = req.params.id
  const userData = req.body

  if (!userData) {
    return res.status(400).json({ message: "Data Must Have Value" })
  }

  try {
    const user = await editUserById(id, userData)

    if (!user) {
      return res.status(404).json({ message: "User Not Found" })
    }

    res.status(200).json({
      data: user,
      message: "Successfully Updated User!",
    })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

const removeUser = async (req, res) => {
  try {
    const userId = req.params.id

    await deleteUserById(userId)

    res.status(200).json({ message: "Successful Delete User!" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const uploadUserPhoto = async (req, res) => {
  try {
    const id = req.params.id
    const user = await getUserById(id)
    console.log("Request Body:", req.body)
    console.log("Request File:", req.file)

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" })
    }

    const image_url = req.file.filename

    const updatedUser = await updateUserPhoto(id, image_url)

    res
      .status(200)
      .json({ message: "Successfully Updated User!", data: updatedUser })
  } catch (error) {
    console.error("Error dalam unggah file:", error)
    res.status(500).json({ message: error.message })
  }
}

const getUserPhoto = async (req, res) => {
  try {
    const id = req.params.id
    const user = await getUserById(id)

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    const imagePath = user.image_url // Assuming 'image_url' is a field in the User model

    if (!imagePath) {
      return res.status(404).json({ message: "User photo not found" })
    }

    // Use path.resolve to get an absolute path
    const absolutePath = path.join(__dirname, "../../upload/user", imagePath)
    console.log("Absolute Path:", absolutePath)
    // Send the image file
    res.sendFile(absolutePath, { headers: { "Content-Type": "image/jpeg" } })
  } catch (error) {
    console.error("Error getting user photo:", error)
    res.status(500).json({ message: error.message })
  }
}

const updatePassword = async (req, res) => {
  try {
    const id = req.params.id
    const data = req.body

    const result = await updateUserPassword(id, data)

    if (!result) {
      return res.status(404).json({ message: "Password doesn't match" })
    }

    return res.status(200).json({ message: "Password updated successfully" })
  } catch (e) {
    console.log("error: " + e.message)
    return res.status(500).json({ message: e.message })
  }
}

module.exports = {
  allUsers,
  userById,
  postUser,
  updateUser,
  removeUser,
  uploadUserPhoto,
  getUserPhoto,
  updatePassword,
}

const authService = require("../service/auth.service")
const authRepository = require("../repository/auth.repository")

const userRegister = async (req, res, next) => {
  try {
    const userData = req.body
    await authService.register(userData)
    return res.status(200).json({ message: "Sign Up Successfull !" })
  } catch (error) {
    next(error)
  }
}

const userLogin = async (req, res, next) => {
  try {
    const userData = req.body
    const result = await authService.login(userData)
    return res.status(200).json({
      message: "Login Successfull !",
      token: result.token,
      userId: result.id,
      role: result.role,
    })
  } catch (error) {
    next(error)
  }
}

const userLogout = async (req, res, next) => {
  try {
    const authHeader =
      req.headers["Authorization"] || req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1]
    await authService.logout(token)
    return res.status(200).json({ message: "Logout Successfull!" })
  } catch (error) {
    next(error)
  }
}

const userDetails = async (req, res, next) => {
  try {
    const result = await authRepository.findUserWithRole()
    return res.status(200).json({ result })
  } catch (error) {
    next(error)
  }
}

module.exports = { userRegister, userLogin, userLogout, userDetails }

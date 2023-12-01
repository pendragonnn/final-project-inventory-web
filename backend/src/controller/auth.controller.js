const authService = require("../service/auth.service");
const authRepository = require("../repository/auth.repository");

const userRegister = async (req, res, next) => {
  try {
    const userData = req.body;
    await authService.register(userData);
    return res.status(200).json({ message: "Sign Up Successfull !" });
  } catch (error) {
    next(error);
  }
};

const userLogin = async (req, res, next) => {
  try {
    const userData = req.body;
    const result = await authService.login(userData);
    return res.status(200).json({
      message: "Login Successfull !",
      token: result.token,
      userId: result.id,
      role: result.role,
      full_name: result.full_name,
    });
  } catch (error) {
    next(error);
  }
};

const userLogout = async (req, res, next) => {
  try {
    const authHeader =
      req.headers["Authorization"] || req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    await authService.logout(token);
    return res.status(200).json({ message: "Logout Successfull!" });
  } catch (error) {
    next(error);
  }
};

const userDetails = async (req, res, next) => {
  try {
    const result = await authRepository.findUserWithRole();
    return res.status(200).json({ result });
  } catch (error) {
    next(error);
  }
};

const userEmail = async (req, res, next) => {
  try {
    const email = req.body.email;
    const result = await authRepository.findUserByEmail(email);
    if (!result) {
      return res.status(404).json({ message: "Email not found" });
    }

    return res
      .status(200)
      .json({ message: "Email verification success!", result });
  } catch (error) {
    next(error);
  }
};

const userResetPassword = async (req, res, next) => {
  try {
    const data = req.body;

    const result = await authService.resetPassword(data);
    return res.status(200).json({ message: "Password Reset Successfully!" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  userRegister,
  userLogin,
  userLogout,
  userDetails,
  userEmail,
  userResetPassword,
};

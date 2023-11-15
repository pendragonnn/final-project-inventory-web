const Auth = require("../repository/auth.repository");
const jwtUtil = require("../util/jwt.util");
const bcrypt = require("bcrypt");

const register = async (userData) => {
  const hashedPassword = await bcrypt.hash(userData.password, 10);

  const existUser = await Auth.findUserByEmail(userData.email);
  if (existUser) {
    const error = new Error("User already exist!");
    error.status = 400;
    throw error;
  }

  const result = await Auth.createUser(userData, hashedPassword);
  return result;
};

const login = async (userData) => {
  const user = await Auth.findUserByEmail(userData.email);

  if (!user) {
    const error = new Error("Invalid username or password");
    error.status = 400;
    throw error;
  }
  const passwordMatch = await bcrypt.compare(userData.password, user.password);
  if (!passwordMatch) {
    const error = new Error("Invalid username or password");
    error.status = 400;
    throw error;
  }

  const result = jwtUtil.encodeToken({ user });
  return result;
};

const logout = async (token) => {
  if (!token) {
    const error = new Error("Token Missing !");
    error.status = 400;
    throw error;
  }

  if (jwtUtil.isTokenBlacklisted(token)) {
    const error2 = new Error("Please login first!");
    error2.status = 401;
    throw error2;
  }

  jwtUtil.blacklistToken(token);
};

module.exports = { register, login, logout };

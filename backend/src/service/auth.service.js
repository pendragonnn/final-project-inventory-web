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
    const error = new Error("Invalid email or password");
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

  // if (jwtUtil.isTokenBlacklisted(token)) {
  //   const error2 = new Error("Please login first!");
  //   error2.status = 401;
  //   throw error2;
  // }

  jwtUtil.blacklistToken(token);
};

const resetPassword = async (data) => {
  const getData = await Auth.findUserByEmail(data.email);
  if (!getData) {
    const error = new Error("Invalid user email");
    error.status = 400;
    throw error;
  }

  console.log(data.password);

  const result = await Auth.editUser(getData.id, {
    role_id: getData.role_id,
    full_name: getData.full_name,
    email: getData.email,
    password: data.password,
    image_url: getData.image_url,
  });

  return result;
};

module.exports = { register, login, logout, resetPassword };

const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const blacklistedTokens = new Set();

const encodeToken = ({ user }) => {
  const token = jwt.sign(
    {
      email: user.email,
      id: user.id,
      role: user.role_id,
      full_name: user.full_name,
    },
    process.env.SECRET_KEY,
    {
      expiresIn: "24h",
    }
  );

  id = user.id;
  role = user.role_id;
  full_name = user.full_name;
  return { token, id, role, full_name };
};

const decodeToken = (token) => {
  const decoded = jwt.verify(token, process.env.SECRET_KEY);

  return decoded;
};

const isTokenBlacklisted = (token) => {
  return blacklistedTokens.has(token);
};

const blacklistToken = (token) => {
  blacklistedTokens.add(token);
};

module.exports = {
  encodeToken,
  decodeToken,
  isTokenBlacklisted,
  blacklistToken,
};

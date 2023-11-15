const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const blacklistedTokens = new Set();

const encodeToken = ({ user }) => {
  const token = jwt.sign(
    {
      email: user.email,
      id: user.id,
      /* role: user.role */
    },
    process.env.SECRET_KEY,
    {
      expiresIn: "24h",
    }
  );

  id = user.id;
  return { token, id };
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

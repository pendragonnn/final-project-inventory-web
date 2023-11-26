const Auth = require("../repository/auth.repository");
const jwtUtil = require("../util/jwt.util");

const authenticateToken = async (req, res, next) => {
  const authHeader =
    req.headers["authorization"] || req.headers["Authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized access: Token not provided" });
  }

  if (jwtUtil.isTokenBlacklisted(token)) {
    return res.status(401).json({ message: "Token has rejected" });
  }

  try {
    const decodedToken = jwtUtil.decodeToken(token);
    const user = await Auth.findUserById(decodedToken.id);

    if (!user) {
      return res.status(401).json({ message: "Invalid user" });
    }

    req.user = user;
    const role = decodedToken.role;
    console.log(role);

    if (
      (role == 2 && req.path === "/supplier") ||
      req.path === "/outlet" ||
      req.path.startsWith("/item") ||
      req.path === "/category" ||
      req.path.startsWith("/transaction-header") ||
      req.path !== "/transaction-header" || // Periksa apakah path dimulai dengan "/transaction-header"
      req.path === "/transaction-detail"
    ) {
      next();
    } else if (role == 1 && req.path === "/user") {
      next();
    } else {
      return res.status(403).send("Forbidden");
    }
    return;
  } catch (error) {
    res.status(401).json({ message: "Unauthorized access" });
  }
};

module.exports = { authenticateToken /*restrictAccess */ };

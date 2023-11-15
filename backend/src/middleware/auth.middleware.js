const jwtUtil = require("../util/jwt.util");

const authenticateToken = (req, res, next) => {
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
    req.email = decodedToken.email;

    // if (decodedToken.role != "admin") {
    //   return res.status(401).json({ message: "Unauthorized access" });
    // }

    // if (req.method == "POST" && decodedToken.role == "admin") {
    //   return next();
    // }

    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized access" });
  }
};

module.exports = authenticateToken;

// const checkUserRole = (role) => (req, res, next) => {
//   if (role && req.user.role !== role) {
//     return res.status(403).json({ message: "Forbidden user!" });
//   }
//   next();
// };

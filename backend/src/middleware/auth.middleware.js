const Auth = require("../repository/auth.repository")
const jwtUtil = require("../util/jwt.util")

const authenticateToken = async (req, res, next) => {
  const authHeader =
    req.headers["authorization"] || req.headers["Authorization"]
  const token = authHeader && authHeader.split(" ")[1]

  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized access: Token not provided" })
  }

  // if (jwtUtil.isTokenBlacklisted(token)) {
  //   return res.status(401).json({ message: "Token has rejected" });
  // }

  try {
    const decodedToken = jwtUtil.decodeToken(token)
    const user = await Auth.findUserById(decodedToken.id)

    if (!user) {
      return res.status(401).json({ message: "Invalid user" })
    }

    req.user = user
    const role = decodedToken.role
    console.log(role)

    if (
      (role == 2 && req.path.startsWith("/asdasd")) ||
      req.path.startsWith("/supplier") ||
      req.path.startsWith("/outlet") ||
      req.path.startsWith("/item") ||
      req.path.startsWith("/role") ||
      req.path.startsWith("/category") ||
      req.path.startsWith("/supplier") ||
      req.path.startsWith("/transaction-header") ||
      req.path.startsWith("/transaction-detail")
    ) {
      next()
    } else if (
      (role == 1 && req.path.startsWith("/user")) ||
      req.path.startsWith("/user/upload")
    ) {
      next()
    } else if (
      (role == 3 && req.path.startsWith("/transaction-header")) ||
      req.path.startsWith("/transaction-detail") ||
      req.path.startsWith("/user")
    ) {
      next()
    } else {
      return res.status(403).send("Forbidden")
    }

    return
  } catch (error) {
    res.status(401).json({ message: "Unauthorized access" })
  }
}

module.exports = { authenticateToken /*restrictAccess */ }

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
      (role == 2 && req.path === "/outlet")
    ) {
      next();
    } else if (
      role == 1 &&
      (req.path === "/transaksi" || req.path === "/report")
    ) {
      next();
    } else {
      return res.status(403).send("Forbidden");
    }

    return;

    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized access" });
  }
};

// const restrictAccess = async (req, res, next) => {
//   try {
//     const user = req.user; // Anda mungkin mendapatkan informasi pengguna setelah melakukan otentikasi

//     if (user && user.role_id === 2) {
//       // Jika role_id pengguna adalah 2 (role yang memiliki akses terbatas)
//       const allowedRoutes = ["/outlet", "/supplier"];
//       const requestedRoute = req.baseUrl; // Mengambil bagian dasar dari rute yang diminta

//       if (!allowedRoutes.includes(requestedRoute)) {
//         return res.status(401).json({ message: "Unauthorized access" });
//       }
//     }

//     next();
//   } catch (error) {
//     res.status(401).json({ message: "Unauthorized access" });
//   }
// };

module.exports = { authenticateToken /*restrictAccess */ };

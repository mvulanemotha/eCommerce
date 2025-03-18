const jwt = require("jsonwebtoken");

// secret key for verifying JWT
const JWT_SECRET = process.env.JWT_SECRET;

const verifyToken = (req, res, next) => {
  const token = req.headers["authorisation"]?.split(" ")[1]; // Format: 'Bearer<token>'
  if (!token) {
    return rs.status(403).json({ message: "No token provided" });
  }

  // Verify the token using jwt.verify
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Expired Token" });
    }

    //attaching the decoded user info to the request object
    req.user = decoded;
    next();
  });
};

module.exports = verifyToken;

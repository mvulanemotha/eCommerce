const jwt = require("jsonwebtoken");

// secret key for verifying JWT
const JWT_SECRET = process.env.JWT_SECRET;

const verifyToken = (req, res, next) => {
  
  const token = req.headers["authorization"]?.split(" ")[1]; // Format: 'Bearer<token>'
  console.log(token)
  if (!token) {
    return res.status(403).json({ message: "Access denied" });
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

module.exports = { verifyToken };

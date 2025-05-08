const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const verifyToken = require("../middleware/authTokens");
const auth = require("../controllers/auth/auth");

const prisma = new PrismaClient();

//auth router
router.post("/", async (req, res) => {
  try {
    //console.log(req.body)
    const { username, password } = req.body;

    //check if user exists
    const user = await prisma.user.findUnique({
      where: {
        email: username,
      },
    });

    if (!user) {
      return res.status(401).json({ error: "Email not registered" });
    }

    // check for passwords
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Password does not match" });
    }

    // generate jwt token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        mobile: user.mobile,
        country: user.country,
        registration: user.createAt,
      },
      token,
    });
  } catch (error) {
    //console.log(error.message);
    res.status(500).json({ error: error.message });
  }
});

// get user details of User if token is not expired
router.get("/userdetails", verifyToken.verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    res.status(200).json({ id: user.id, name: user.name, role: user.role });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
});

//send a reset link
router.post("/send", auth.sendResetLink);

//reset password
router.post("/reset", verifyToken.verifyToken, auth.resetpassword);

module.exports = router;

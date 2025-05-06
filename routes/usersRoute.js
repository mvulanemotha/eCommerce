const express = require("express");
const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");
const verifyToken = require("../middleware/authTokens")
const prisma = new PrismaClient();
const router = express.Router();

//create User
router.post("/register", async (req, res) => {
  try {

    const { email, password, name, role , mobile , country } = req.body;

    //check if the email is already taken
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }

    // create user
    const hashedPassword = await bcrypt.hash(password, 10);

    //create user
    const newUser = await prisma.user.create({
      data: {
        email: email,
        password: hashedPassword,
        name: name,
        role: role,
        mobile: mobile,
        country: country
      },
    });

    // response data
    res.status(201).json({
      message: "New user created succesfully",
      data: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// get user details
/*router.get("/user", verifyToken.verifyToken , async(req , res)=> {

   console.log(req) 

})*/

module.exports = router;

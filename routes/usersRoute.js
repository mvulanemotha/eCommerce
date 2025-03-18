const express = require("express");
const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const router = express.Router();

//create User
router.post("/", async (req, res) => {
  try {
    const { email, password, name } = req.body;

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
        email,
        password: hashedPassword,
        name,
      },

      select: {
        id: true,
        email: true,
        createdAt: true,
      },
    });

    // response data
    res.status(201).json({ message: "New user created succesfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");

//send an email for a reset link

const sendResetLink = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
      include: {
        password: false,
      },
    });

    if (!user) {
      res.status(404).json({ message: "User Not Found ..." });
    }

    //create token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    const resetLink = `${process.env.FRONT_END_URL}resetpassword?token=${token}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.user,
        pass: process.env.pass,
      },
    });

    const mailOptions = {
      from: process.env.user,
      to: email,
      subject: "Reset Your Password",
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>
        
        Regards<br>
        SpheExpress
        `,
    };

    const result = await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Reset link sent" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

// reset password forgotten password
const resetpassword = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const updated = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        password: hashedPassword,
      },
    });

    if (updated) {
      return res.status(200).json({ message: "Updated Successfully" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

//chnage a user password
const changepass = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.userId;
    console.log(req.user);

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    //check if the passwords do match with the one in the database
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    console.log(isMatch);
    if (!isMatch) {
      return res.status(403).json({ error: "Password mismatch" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    //update database
    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        password: hashedPassword,
      },
    });

    return res.status(201).json({ message: "Updated Successfully" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { sendResetLink, resetpassword, changepass };

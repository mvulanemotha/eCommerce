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
      to: process.env.user,
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

// reset password
const resetpassword = async (req, res) => {
  try {
    
    const userId = req.user.userId
    const { password } = req.body;

    const hashedPassword = await bcrypt.hash(password , 10)

    const updated = await prisma.user.update({
        where : {
            id: userId
        },
        data : {
            password: hashedPassword
        }
    })

    console.log(updated)
    

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { sendResetLink , resetpassword };

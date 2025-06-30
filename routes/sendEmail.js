const nodemailer = require("nodemailer");
const express = require("express");
const router = express.Router();

// Route to send email
router.post("/", async (req, res) => {
  const { email, name, message, hireMe } = req.body;

  console.log(hireMe);

  const sendEmail = async (email, name, message, hireMe) => {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.user,
        pass: process.env.pass,
      },
    });

    if (hireMe === true) {
      hireMe = "I want to hire you";
    } else {
      hireMe = "I don't want to hire you at the moment";
    }

    const mailOptions = {
      from: email,
      to: process.env.user,
      subject: "Personal Website Email Address",
      html: `
        <p><strong>Senders Name:</strong> ${name}</p>
        <p><strong>Senders Email:</strong> ${email}</p></br>
        <p><strong>Message:</strong><br><br>${message}</p>
        <p><strong style="color: green;">${hireMe}</strong></p>
        <br>
        Regards,<br>
        Mkhululi Personal Website
        `,
    };

    const result = await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Email sent successfully" });
  };

  sendEmail(email, name, message, hireMe).catch((error) => {
    console.log(error);
    res.status(500).json({ error: error.message });
  });
});

module.exports = router;

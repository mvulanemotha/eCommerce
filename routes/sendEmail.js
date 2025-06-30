
const nodemailer = require("nodemailer");
const express = require("express");
const router = express.Router();


// Route to send email
router.post("/", async (req, res) => {

    const { email, name, message } = req.body;

    const sendEmail = async (email, name , message) => {
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
        subject: "Personal Website Email Address",
        html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong><br>${message}</p>
        <p><strong style="color: green;">Yes, I want to hire you ✅</strong></p>
        <br>
        Regards,<br>
        Mkhululi Personal Website
        `,
    };

    const result = await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Email sent successfully" });
    };

    sendEmail(email, name, message)
    .catch((error) => { 
        console.log(error);
        res.status(500).json({ error: error.message });
    })

})

module.exports = router;

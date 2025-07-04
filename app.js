const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const verifyToken = require("./middleware/authTokens");
const path = require("path");

const app = express();

//middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));
app.use("/api/images", express.static(path.join(__dirname, "public/images")));

// routes block
const users = require("./routes/usersRoute");
const auth = require("./routes/authRoute");
const orders = require("./routes/orderRoute");
const products = require("./routes/productRoute");
const contact = require("./routes/contactRouter");
const sendEmail = require("./routes/sendEmail");

app.use("/api/users", users);
app.use("/api/auth", auth);
app.use("/api/orders", verifyToken.verifyToken, orders);
app.use("/api/products", products);
app.use("/api/contact", contact);
app.use("/api/sendemail", sendEmail);

//404 Error hangling
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

// Global Error Handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    error: {
      message: err.message,
    },
  });
});

module.exports = app;

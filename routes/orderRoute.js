const express = require("express");
const router = express.Router();
const { PrismaClient, OrderStatus } = require("@prisma/client");
const createCheckOut = require("../services/stripservice/stripeservice");
const orders = require("../controllers/orders/order");
const verifyToken = require("../middleware/authTokens");
const prisma = new PrismaClient();
const { orderInstance } = require("../controllers/orders/order");

// make a payment
router.post("/pay", async (req, res) => {
  const result = await orders.placeOrder(req, res);

  if (result === "NONE") {
    await createCheckOut.createCheckOut(req, res, orderInstance.orderId);
  } else {
    res.status(400).json({ error: result });
  }
  //place the order
});

//verify payment
router.get("/verify", async (req, res) => {
  try {
    const { session_id } = req.query;

    //Retrive session details from stripe
    await createCheckOut.verifyPayment(session_id, res);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
});

// order an item
router.post("/create", async (req, res) => {});

//get my orders
router.get("/myorders", verifyToken.verifyToken, async (req, res) => {
  await orders.myOrders(req.user.userId, res);
});

module.exports = router;

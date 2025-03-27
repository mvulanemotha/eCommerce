const express = require("express");
const router = express.Router();
const { PrismaClient, OrderStatus } = require("@prisma/client");
const createCheckOut = require("../services/stripservice/stripeservice");
const placeOrder = require("../controllers/orders/order")

const prisma = new PrismaClient();

// make a payment
router.post("/pay", async (req, res) => {
  const mydata = req.body.cartItem;
  //console.log(mydata);
  //await createCheckOut.createCheckOut(req, res);
  await placeOrder.placeOrder(req, res)
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
router.post("/create", async (req, res) => {
  
   

});

module.exports = router;

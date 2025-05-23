const { PrismaClient, OrderStatus } = require("@prisma/client");
const prisma = new PrismaClient();
const url = process.env.FRONT_END_URL;

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const createCheckOut = async (req, res, orderId) => {
  try {
    //save the order if
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"], // Accepts credit/debit cards
      line_items: req.body.cartItem.map((item) => ({
        price_data: {
          currency: "zar",
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.count,
      })),
      mode: "payment", //One time payment
      success_url: `${url}paymentsuccess?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${url}paymentfailed/`,
    });

    //console.log(session);

    //save session Id with orderId
    const stripeDetails = await prisma.stripe.create({
      data: {
        orderId: orderId,
        sessionId: session.id,
      },
    });

    res.json({ id: session.id });
  } catch (error) {
    console.log(error.message);
    res.status(500).json("Error creating checkout session.");
  }
};

// verify payment details by getting the session details
const verifyPayment = async (session_id, res) => {
  try {
    //Get session details
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status === "paid") {
      // select
      //console.log(session_id);
      // Retrive the stripe details using sessionId
      const stripeRecord = await prisma.stripe.findUnique({
        where: { sessionId: session_id },
        include: {
          order: {
            include: {
              orderItems: true,
            },
          },
        },
      });

      if (!stripeRecord) {
        return res
          .status(404)
          .json({ status: "error", message: "Payment record not found." });
      }

      // update order status
      const updateOrder = await prisma.order.update({
        where: { id: stripeRecord.orderId },
        data: {
          status: "PAID",
        },
      });

      const orderItems = stripeRecord.order.orderItems
      // check if order was updated perfectly
      if (updateOrder) {
        for (const item of orderItems) {
          await prisma.product.update({
            where: {
              id: item.productId,
            },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          });
        }
      }
    }

    if (session.payment_status === "paid") {
      res.json({ status: "success" });
    } else {
      res.json({ status: "failed" });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: "error", message: "Unable to verify payment" });
  }
};

module.exports = { createCheckOut, verifyPayment };

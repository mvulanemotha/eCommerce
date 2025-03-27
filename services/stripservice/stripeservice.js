const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const createCheckOut = async (req, res) => {
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
      success_url:
        "http://localhost:5173/paymentsuccess?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "http://localhost:5173/paymentfailed/",
    });

    //console.log(session);

    res.json({ id: session.id });

    
  } catch (error) {
    console.log("Problems");
    res.status(500).json("Error creating checkout session.");
  }
};

// verify payment details by getting the session details
const verifyPayment = async (session_id , res) => {
  try {
    //Get session details
    const session = await stripe.checkout.sessions.retrieve(session_id);

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

module.exports = { createCheckOut , verifyPayment };

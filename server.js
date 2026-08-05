require("dotenv").config();

const express = require("express");
const cors = require("cors");
const Stripe = require("stripe");

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const app = express();

console.log("นี่คือ server.js ตัวที่กำลังรัน");
console.log(__dirname);

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

const PORT = 3000;
app.post("/create-checkout-session", async (req, res) => {

  console.log("มีการเรียก create-checkout-session");

  try {
    const { amount } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["promptpay"],
      line_items: [
        {
          price_data: {
            currency: "thb",
            product_data: {
              name: "ค่าอาหาร",
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "http://localhost:3000/success.html",
      cancel_url: "http://localhost:3000/cancel.html",
    });

    res.json({ url: session.url });

  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});
app.listen(PORT, () => {
console.log(`Server running at http://localhost:${PORT}`);
});
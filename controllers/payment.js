import stripe from "stripe";
const Stripe = stripe(
  "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"
);

const initiatePayment = async (req, res) => {
  const { amount } = req.body;

  try {
    const paymentIntent = await Stripe.paymentIntents.create({
      amount: amount * 100,
      currency: "usd",
      payment_method_types: ["card"],
    });

    res.json({
      response: paymentIntent,
    });
  } catch (e) {
    res.json({
      error: e.message,
    });
  }
};

export { initiatePayment };

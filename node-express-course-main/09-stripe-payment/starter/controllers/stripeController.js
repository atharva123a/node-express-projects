const stripe = require("stripe")(process.env.STRIPE_SECRET);

// we have access to req.body, because the front end sends us the response:
const stripeController = async (req, res) => {
  const { purchase, total_amount, shipping_fee } = req.body;

  const calculateOrderAmount = () => {
    return total_amount + shipping_fee;
  };
  //   in case of indian payment gateways we need to create a customer!
  const customer = await stripe.customers.create({
    name: "Athens Badass",
    address: {
      line1: "510 Townsend St",
      postal_code: "98140",
      city: "San Francisco",
      state: "CA",
      country: "US",
    },
  });

  //   here we create a paymentIntent and we need to pass in the required properties. these cater to indian needs:
  const paymentIntent = await stripe.paymentIntents.create({
    description: "Software development services",
    shipping: {
      name: "Athens Badass",
      address: {
        line1: "510 Townsend St",
        postal_code: "98140",
        city: "San Francisco",
        state: "CA",
        country: "US",
      },
    },
    amount: calculateOrderAmount(),
    currency: "usd",
    payment_method_types: ["card"],
  });

  res.send({ clientSecret: paymentIntent.client_secret });
};

module.exports = stripeController;

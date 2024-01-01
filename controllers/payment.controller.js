import stripe from 'stripe';

const stripeSecretKey = 'sk_test_51OMxQhAJZIgfUYZlVnt8YM7FfRjYogJKM41I4QuBZIoI2IafnR5jcD2O702KlGYIqIvtzKBayuuOnLUEwMs6BuVx00doOIHHn1';

const stripeInstance = stripe(stripeSecretKey);

export const pay = async (req, res) => {
console.log(req.body)

  // Use an existing Customer ID if this is a returning customer.
  const customer = await stripeInstance.customers.create();
  const ephemeralKey = await stripeInstance.ephemeralKeys.create(
    { customer: customer.id },
    { apiVersion: '2023-10-16' }
  );
  const paymentIntent = await stripeInstance.paymentIntents.create({
    amount: Math.round(req.body.price * 100) ?? 20,
    currency: 'eur',
    customer: customer.id,
    // In the latest version of the API, specifying the automatic_payment_methods parameter is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.json({
    paymentIntent: paymentIntent.client_secret,
    ephemeralKey: ephemeralKey.secret,
    customer: customer.id,
    publishableKey: 'pk_test_51OMxQhAJZIgfUYZlCxwpf5OtxUesG9OIcGWGrkO9zrZ8Cey58PdYdUK27IHMnj3hAufYkqCr1YdtGFixOaTcmUJZ00S7lG3cYl'
  });
};
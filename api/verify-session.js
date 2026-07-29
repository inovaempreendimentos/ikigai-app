const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  const sessionId = req.query.session_id;
  if (!sessionId) {
    res.status(400).json({ error: 'session_id is required' });
    return;
  }
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    res.status(200).json({ paid: session.payment_status === 'paid' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

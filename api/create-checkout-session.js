const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  try {
    const body = req.body || {};
    const archetype = body.archetype || '';
    const origin = req.headers.origin || `https://${req.headers.host}`;

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: {
              name: 'Ikigai — Mapa de Carreira Aprofundado',
              description: 'Aprofundamento personalizado dentro do seu arquétipo Ikigai, com sub-áreas específicas e primeiros passos.',
            },
            unit_amount: 1290, // R$ 12,90
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/?paid=1&session_id={CHECKOUT_SESSION_ID}&arch=${encodeURIComponent(archetype)}`,
      cancel_url: `${origin}/?canceled=1`,
      metadata: {
        projeto: 'ikigai',
      },
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

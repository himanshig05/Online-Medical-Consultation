import Stripe from 'stripe';

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  const { session_id } = req.query;

  if (!session_id) {
    return res.status(400).json({ error: 'Session ID is required' });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id,{});
    res.status(200).json(session);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve session', details: err.message });
  }
}

const stripe = require("stripe")(process.env.STRIPE_SECRET);

exports.createPaymentIntent = async (req, res) => {
    try {
        let { amount } = req.body;
        const currency = 'usd';

        if (!amount) {
            return res.status(400).send({ error: 'Amount is required.' });
        }

        amount = Number(amount);
        if (!Number.isInteger(amount) || amount <= 0) {
            return res.status(400).send({ error: 'Amount must be a positive integer.' });
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
            payment_method_types: ['card']
        }, {
            idempotencyKey: `${amount}-${currency}-${Date.now()}`
        });

        res.send({
            clientSecret: paymentIntent.client_secret
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error.message });
    }
};

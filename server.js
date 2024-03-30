const stripe = require('stripe')("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");
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
const router = express.Router();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));


router.post('/payment', async (req, res) => {

    const { amount } = req.body;
    console.log(amount);
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100,
            currency: 'usd',
            payment_method_types: ['card'],
            // payment_method_options: "card",
            // automatic_payment_methods: {
            //     enabled: true,
            // },
        });

        // const session = await stripe.checkout.sessions.create({
        //     success_url: 'https://example.com/success',
        //     line_items: [
        //         {
        //             price: "price_1Ow0DhP7aIf9ZJPYiJSoWD8l",
        //             quantity: 2,
        //         },
        //     ],
        //     mode: 'payment',
        // });

        res.json({
            response: paymentIntent
        })
    } catch (error) {
        res.json({
            error: error.message,
        })
    }
})


app.use("/api", router);

app.listen(process.env.PORT || 5000, () => {
    console.log("Server is running on port 5000");
})
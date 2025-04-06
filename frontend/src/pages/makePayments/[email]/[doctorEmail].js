import React, { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import axios from "axios";
import { loadStripe } from '@stripe/stripe-js';

const MakePayments = () => {
    const router = useRouter();
    const [history, setHistory] = useState([]);
    const { data: session } = useSession();
    const patientEmail = router.query.email;
    const doctorEmail = router.query.doctorEmail;

    const [form, setForm] = useState({
        amount: "",
    });


    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');
            const stripeResponse = await axios.post(
                `http://localhost:5000/payment/paynow/${patientEmail}`,
                {
                    amount: form.amount,
                    doctorEmail : doctorEmail
                }
            );
            console.log("stripe response : ",stripeResponse);

            const session = stripeResponse.data;
            console.log("session : ",session);

            const result = stripe?.redirectToCheckout({
                sessionId: session.id
            });

            if ((await result)?.error) {
                console.error('Error during checkout redirect:', (await result)?.error.message);
                alert(`Error: ${(await result)?.error.message}`);
            }
            else {
                console.log('Payment gateway called:', result);
                alert('Redirecting to payment gateway...');
            };
        } catch (error) {
            console.error("Payment initiation failed", error);
            router.push("/failure");
        }
    };

    return (
        <div>
            <h2>Patient Payment</h2>
            <form onSubmit={handleSubmit}>
                <input type="number" name="amount" placeholder="Amount (INR)" required onChange={handleChange} />
                <button type="submit">Proceed to Pay</button>
            </form>
        </div>
    );
};

export default MakePayments;

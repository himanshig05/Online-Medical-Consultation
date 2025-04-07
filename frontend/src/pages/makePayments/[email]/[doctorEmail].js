import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import {BASE_URL} from "../../../helper.js";

const MakePayments = () => {
  const router = useRouter();
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
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");
      const stripeResponse = await axios.post(
        `${BASE_URL}/payment/paynow/${patientEmail}`,
        {
          amount: form.amount,
          doctorEmail: doctorEmail,
        }
      );

      const session = stripeResponse.data;
      const result = stripe?.redirectToCheckout({
        sessionId: session.id,
      });

      if ((await result)?.error) {
        console.error("Error during checkout redirect:", (await result)?.error.message);
        alert(`Error: ${(await result)?.error.message}`);
      } else {
        alert("Redirecting to payment gateway...");
      }
    } catch (error) {
      console.error("Payment initiation failed", error);
      router.push("/failure");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Patient Payment</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
              Amount (INR)
            </label>
            <input
              type="number"
              name="amount"
              placeholder="Enter amount"
              required
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-md shadow-md transition duration-300"
          >
            Proceed to Pay
          </button>
        </form>
      </div>
    </div>
  );
};

export default MakePayments;
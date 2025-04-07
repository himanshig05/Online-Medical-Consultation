import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { CheckCircleIcon } from "@heroicons/react/24/solid"; // Optional: Tailwind Hero Icons
import {BASE_URL} from "../helper.js";

const Success = () => {
  const router = useRouter();
  const { session_id } = router.query;

  const [loading, setLoading] = useState(true);
  const [sessionDetails, setSessionDetails] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      if (!session_id) return;

      try {
        const res = await fetch(`/api/checkout-session?session_id=${session_id}`);
        const data = await res.json();
        setSessionDetails(data);

        // Update fee status
        await fetch(`${BASE_URL}/payment/updateStatus`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sessionId: session_id,
          }),
        });
      } catch (err) {
        console.error("Failed to fetch session", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [session_id]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-lg">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 px-4 py-12">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md text-center">
        <div className="flex justify-center mb-4">
          <CheckCircleIcon className="h-12 w-12 text-green-600" />
        </div>
        <h2 className="text-2xl font-semibold text-green-700 mb-2">Payment Successful!</h2>
        <p className="text-gray-700 mb-6">Thank you for your payment.</p>

        {sessionDetails ? (
          <div className="text-left text-sm text-gray-600">
            <p><span className="font-medium">Amount Paid:</span> ₹{sessionDetails.amount_total / 100}</p>
            <p className="mt-2 text-green-600 font-medium">Your payment has been processed successfully.</p>
          </div>
        ) : (
          <p className="text-red-500">Could not fetch session details.</p>
        )}

        <button
          onClick={() => router.push("/")}
          className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default Success;

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

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

        //update fee status
        await fetch("http://localhost:5000/payment/updateStatus", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sessionId: session_id,
          }),
        });

      } catch (err) {
        console.error('Failed to fetch session', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [session_id]);

  if (loading) return <p>Loading payment details...</p>;

  return (
    <div>
      <h2>🎉 Payment Successful!</h2>
      {sessionDetails ? (
        <>
          {/* <p>Customer: {sessionDetails.customer_details?.email}</p>
          <p>Amount Paid: ₹{sessionDetails.amount_total / 100}</p> */}
        </>
      ) : (
        <p>Could not fetch session details.</p>
      )}
    </div>
  );
};

export default Success;



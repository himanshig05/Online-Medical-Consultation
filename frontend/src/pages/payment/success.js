import Link from "next/link";

const Success = () => {
  return (
    <div>
      <h2>Payment Successful!</h2>
      <p>Your payment has been successfully processed.</p>
      <Link href="/patient-history">View Payment History</Link>
    </div>
  );
};

export default Success;

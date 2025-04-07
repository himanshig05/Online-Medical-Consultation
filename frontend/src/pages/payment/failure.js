import Link from "next/link";

const Failure = () => {
  return (
    <div>
      <h2>Payment Failed!</h2>
      <p>Something went wrong. Please try again.</p>
      <Link href="/">Retry Payment</Link>
    </div>
  );
};

export default Failure;

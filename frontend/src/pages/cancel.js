import Link from "next/link";

const Failure = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "3rem" }}>
      <h2 style={{ color: "red" }}>Payment Failed!</h2>
      {/* <p>Please try again.</p> */}
      <Link href="/">
        <button style={{ padding: "0.5rem 1rem", marginTop: "1rem" }}>
          Retry Payment
        </button>
      </Link>
    </div>
  );
};

export default Failure;

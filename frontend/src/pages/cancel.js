import Link from "next/link";

const Failure = () => {
  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Payment Failed</h2>
      <p style={styles.subtext}>Something went wrong. Please try again.</p>
      <Link href="/" passHref>
        <button style={styles.button}>Retry Payment</button>
      </Link>
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    marginTop: "4rem",
    padding: "2rem",
    backgroundColor: "#fff3f3",
    borderRadius: "8px",
    maxWidth: "500px",
    margin: "4rem auto",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },
  heading: {
    color: "#e53935",
    fontSize: "2rem",
    marginBottom: "0.5rem",
  },
  subtext: {
    color: "#555",
    fontSize: "1rem",
    marginBottom: "1.5rem",
  },
  button: {
    backgroundColor: "#e53935",
    color: "#fff",
    border: "none",
    padding: "0.75rem 1.5rem",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "1rem",
  },
};

export default Failure;



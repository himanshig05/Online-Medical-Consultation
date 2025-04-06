import { useEffect, useState } from "react";
import axios from "axios";

const PatientHistory = () => {
  const [history, setHistory] = useState([]);
  const patientEmail = typeof window !== "undefined" ? localStorage.getItem("userEmail") : null ; // Get email from localStorage

  useEffect(() => {
    if(!patientEmail){
      console.error("User email not found!");
      return;
    }

    const fetchHistory = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/payment/patient/${patientEmail}`);
        setHistory(response.data.details);
      } catch (error) {
        console.error("Failed to fetch payment history", error);
      }
    };

    fetchHistory();
  }, [patientEmail]);

  return (
    <div>
      <h2>Patient Payment History</h2>
      {history.length > 0 ? (
        history.map((payment, index) => (
          <div key={index}>
            <p>Doctor: {payment.doctorName}</p>
            <p>Amount: ₹{payment.transactions[0].amount}</p>
            <p>Status: {payment.transactions[0].status}</p>
          </div>
        ))
      ) : (
        <p>No payment history found.</p>
      )}
    </div>
  );
};

export default PatientHistory;

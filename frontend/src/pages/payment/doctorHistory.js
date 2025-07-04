import { useEffect, useState } from "react";
import axios from "axios";
import {BASE_URL} from "../../helper.js";

const DoctorHistory = () => {
  const [history, setHistory] = useState([]);
  const doctorEmail = typeof window !== "undefined" ? localStorage.getItem("userEmail") : null; // Get email from localStorage

  useEffect(() => {
    if (!doctorEmail) {
      console.error("Doctor email not found!");
      return;
    }

    const fetchHistory = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/payment/doctor/${doctorEmail}`);
        setHistory(response.data.details);
      } catch (error) {
        console.error("Failed to fetch payment history", error);
      }
    };

    fetchHistory();
  }, [doctorEmail]);

  return (
    <div>
      <h2>Payment History</h2>
      {history.length > 0 ? (
        history.map((payment, index) => (
          <div key={index}>
            <p>Patient: {payment.patientName}</p>
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

export default DoctorHistory;

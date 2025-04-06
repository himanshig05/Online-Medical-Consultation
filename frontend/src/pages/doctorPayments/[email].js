import React, { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import axios from "axios";

const DoctorPayments = () => {
    const router = useRouter();
    const [history, setHistory] = useState([]);
    const { data: session } = useSession();
    const doctorEmail = router.query.email;

    useEffect(() => {
        console.log("doctor email",doctorEmail);
        if (router.isReady) {

            const fetchHistory = async () => {
                try {
                    const response = await axios.get(`http://localhost:5000/payment/view-doctor/${doctorEmail}`);
                    setHistory(response.data);
                } catch (error) {
                    console.error("Failed to fetch payment history", error);
                }
            };

            fetchHistory();
        }
    }, [router.isReady]);

    return (
        <div>
          <h2>Doctor Payment History</h2>
          {history.length > 0 ? (
            history.map((payment, index) => (
              <div key={index} style={{ border: "1px solid #ccc", padding: "10px", margin: "10px 0" }}>
                <h3>Patient: {payment.patientEmail}</h3>
                <ul>
                  {[...payment.transactions].reverse().map((txn, txnIndex) => (
                    <li key={txnIndex}>
                      Amount: ₹{txn.amount} | Status: {txn.status} | Date: {new Date(txn.date).toLocaleString()}
                    </li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <p>No payment history found.</p>
          )}
        </div>
      );
      
      
};


export default DoctorPayments;

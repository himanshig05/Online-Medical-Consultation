import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import axios from "axios";
import { BASE_URL } from "../../helper.js";

const DoctorPayments = () => {
  const router = useRouter();
  const [history, setHistory] = useState([]);
  const [expandedIndexes, setExpandedIndexes] = useState({});
  const { data: session } = useSession();
  const doctorEmail = router.query.email;

  useEffect(() => {
    if (router.isReady && doctorEmail) {
      const fetchHistory = async () => {
        try {
          const response = await axios.get(`${BASE_URL}/payment/view-doctor/${doctorEmail}`);
          setHistory(response.data);
        } catch (error) {
          console.error("Failed to fetch payment history", error);
        }
      };

      fetchHistory();
    }
  }, [router.isReady, doctorEmail]);

  const toggleExpand = (index) => {
    setExpandedIndexes((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div style={{ maxWidth: "800px", margin: "30px auto", fontFamily: "Segoe UI, sans-serif" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px", fontWeight: "bold", fontSize: "30px" }}>Payment History</h2>
      {history.length > 0 ? (
        history.map((payment, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: "15px",
              marginBottom: "15px",
              backgroundColor: "#f9f9f9",
              boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
            }}
          >
            <div
              onClick={() => toggleExpand(index)}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "16px",
                color: "#333",
              }}
            >
              <span>Patient: {payment.patientEmail}</span>
              <span
                style={{
                  transform: expandedIndexes[index] ? "rotate(90deg)" : "rotate(0deg)",
                  transition: "transform 0.3s ease",
                  fontSize: "18px",
                }}
              >
                ▶
              </span>
            </div>

            {expandedIndexes[index] && (
              <div style={{ marginTop: "10px", overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "15px" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#e0e0e0" }}>
                      <th style={{ border: "1px solid #ccc", padding: "8px" }}>Amount (₹)</th>
                      <th style={{ border: "1px solid #ccc", padding: "8px" }}>Status</th>
                      <th style={{ border: "1px solid #ccc", padding: "8px" }}>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...payment.transactions].reverse().map((txn, txnIndex) => (
                      <tr key={txnIndex}>
                        <td style={{ border: "1px solid #ccc", padding: "8px" }}>{txn.amount}</td>
                        <td style={{ border: "1px solid #ccc", padding: "8px" }}>{txn.status}</td>
                        <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                          {new Date(txn.date).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))
      ) : (
        <p style={{ textAlign: "center", color: "#888" }}>No payment history found.</p>
      )}
    </div>
  );
};

export default DoctorPayments;
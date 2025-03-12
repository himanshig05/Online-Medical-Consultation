import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';

const DoctorRequests = () => {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState(null);
  const doctorEmail = "ananyaapriyadarshini.bt23cse@pec.edu.in"; // Replace with dynamic value if needed

  // ✅ Function to Fetch Requests
  const fetchRequests = async () => {
    try {
      setError(null);
      const response = await fetch(`http://localhost:5000/api/requests/getAllRequests/${doctorEmail}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch requests");
      }

      setRequests(Array.isArray(data.requests) ? data.requests : []);
    } catch (err) {
      setError(err.message);
    }
  };

  // ✅ Function to Update Request Status
  const updateRequest = async (patientEmail, newStatus) => {
    try {
      const response = await fetch("http://localhost:5000/api/requests/UpdateRequest", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doctorEmail, patientEmail, status: newStatus }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update request");
      }

      // ✅ Update UI Immediately
      setRequests((prevRequests) =>
        prevRequests.map((req) =>
          req.patientEmail === patientEmail ? { ...req, status: newStatus } : req
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  // ✅ Call fetchRequests Inside useEffect
  useEffect(() => {
    fetchRequests();
  }, [doctorEmail]);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Doctor Requests</h1>
      {error && <p style={styles.errorText}>Error: {error}</p>}

      <TableContainer component={Paper} style={styles.tableContainer}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell style={styles.tableHeader}>Patient Email</TableCell>
              <TableCell style={styles.tableHeader}>Status</TableCell>
              <TableCell style={styles.tableHeader}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {requests.map((req) => (
              <TableRow key={req._id} style={styles.tableRow}>
                <TableCell>{req.patientEmail}</TableCell>
                <TableCell
                  style={{
                    ...styles.statusText,
                    color:
                      req.status === "accepted"
                        ? "green"
                        : req.status === "rejected"
                        ? "red"
                        : "black",
                  }}
                >
                  {req.status}
                </TableCell>
                <TableCell>
                  <Button
                    onClick={() => updateRequest(req.patientEmail, "accepted")}
                    style={{
                      ...styles.actionButton,
                      backgroundColor: req.status === "accepted" ? "#4CAF50" : "#fff",
                      color: req.status === "accepted" ? "#fff" : "#000",
                      border: "2px solid #4CAF50",
                    }}
                  >
                    Accept
                  </Button>
                  <Button
                    onClick={() => updateRequest(req.patientEmail, "rejected")}
                    style={{
                      ...styles.actionButton,
                      backgroundColor: req.status === "rejected" ? "#f44336" : "#fff",
                      color: req.status === "rejected" ? "#fff" : "#000",
                      border: "2px solid #f44336",
                    }}
                  >
                    Reject
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

// ✅ Styling Improvements
const styles = {
  container: {
    padding: '30px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f5f7fa',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    color: '#00698f',
    marginBottom: '20px',
    fontSize: '28px',
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  errorText: {
    color: 'red',
    marginBottom: '20px',
    fontSize: '16px',
    fontWeight: 'bold',
  },
  tableContainer: {
    borderRadius: '10px',
    boxShadow: '0px 4px 15px rgba(0,0,0,0.15)',
    overflowX: 'auto',
    backgroundColor: '#ffffff',
    maxWidth: '800px',
    width: '100%',
  },
  tableHeader: {
    fontWeight: 'bold',
    fontSize: '16px',
    backgroundColor: '#00698f',
    color: '#fff',
    textAlign: 'center',
  },
  tableRow: {
    '&:hover': {
      backgroundColor: '#f1f1f1',
    },
  },
  statusText: {
    fontWeight: 'bold',
    textTransform: 'capitalize',
    fontSize: '14px',
    textAlign: 'center',
  },
  actionButton: {
    margin: '5px',
    padding: '8px 16px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease-in-out',
  },
};

export default DoctorRequests;

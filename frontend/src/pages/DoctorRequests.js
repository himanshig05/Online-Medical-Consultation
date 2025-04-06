import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import { signOut, useSession } from 'next-auth/react'; // Ensure next-auth is correctly set up for signOut
import Link from 'next/link'; // Ensure Link is imported
import { FaSun, FaMoon } from 'react-icons/fa'; // Import icons for dark mode toggle
import { BASE_URL } from "../helper.js";
const DoctorRequests = () => {
  const { data: session, status } = useSession();

  const [requests, setRequests] = useState([]);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false); // State for Dark Mode
  const doctorEmail = session?.user?.email; // Get doctor email from session
  // Function to toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark', !darkMode); // Toggle dark mode globally
  };

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      fetchRequests(session.user.email);
    }
  }, [status, session]);

  // Fetch Requests function
  const fetchRequests = async () => {
    try {
      setError(null);
      console.log("doctorEmail: ", doctorEmail);
      const response = await fetch(`${BASE_URL}/api/requests/getAllRequests/${doctorEmail}`);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch requests");
      }

      setRequests(Array.isArray(data.requests) ? data.requests : []);
    } catch (err) {
      setError(err.message);
    }
  };

  if (status === "loading") {
    return <div className="flex items-center justify-center min-h-screen text-xl">Loading...</div>;
  }
  // Update Request Status function
  const updateRequest = async (patientEmail, newStatus) => {
    try {
      const response = await fetch(`${BASE_URL}/api/requests/UpdateRequest`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doctorEmail, patientEmail, status: newStatus }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update request");
      }

      setRequests((prevRequests) =>
        prevRequests.map((req) =>
          req.patientEmail === patientEmail ? { ...req, status: newStatus } : req
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  // Call fetchRequests Inside useEffect
  // useEffect(() => {
  //   fetchRequests();
  // }, [doctorEmail]);

  return (
    <div style={styles.container}>
      {/* Navbar */}
      <div className="w-full px-2 flex justify-between items-center">
        <div className="flex justify-between">
          <div className="text-4xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-700 p-5">
            MediCare
          </div>
        </div>
        <div className="flex justify-center" style={{ color: 'black' }}>
          <ul className="flex justify-between space-x-8 uppercase p-5 mr-12">
            <li className="text-lg font-medium ml-10">
              <Link href="/">Home</Link>
            </li>
            <li className="text-lg font-medium ml-10">
              <Link href="/Messenger">PATIENTS</Link>
            </li>
            <li className="text-lg font-medium ml-10">
              <Link href="/DoctorRequests">VERIFY REQUESTS</Link>
            </li>
            <li className="text-lg font-medium ml-10">
              <button onClick={() => signOut({ callbackUrl: "/" })}>SIGN OUT</button>
            </li>
            <button
              onClick={toggleDarkMode}
              className="flex items-center space-x-2 text-lg font-medium text-blue-700 hover:text-blue-500"
            >
              {darkMode ? <FaSun className="text-yellow-400" size={20} /> : <FaMoon className="text-blue-500" size={20} />}
            </button>
          </ul>
        </div>
      </div>

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

// Styling improvements
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

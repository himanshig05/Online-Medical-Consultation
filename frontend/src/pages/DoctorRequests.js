<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import { signOut, useSession } from 'next-auth/react'; // Ensure next-auth is correctly set up for signOut
import Link from 'next/link'; // Ensure Link is imported
import { FaSun, FaMoon } from 'react-icons/fa'; // Import icons for dark mode toggle
import { BASE_URL } from "../helper.js";
const DoctorRequests = () => {
  const { data: session, status } = useSession();

=======
import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  ThemeProvider,
  createTheme,
  CssBaseline,
} from "@mui/material";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { FaSun, FaMoon } from "react-icons/fa";
import { BASE_URL } from "../helper.js";

const lightTheme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: "#FFFFFF", // Complete white for light mode
    },
    text: {
      primary: "#000000", // Black text in light mode
    },
  },
});


const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#121212", // Solid dark background in dark mode
    },
    text: {
      primary: "#FFFFFF", // White text in dark mode
    },
  },
});

const DoctorRequests = () => {
  const { data: session, status } = useSession();
>>>>>>> 86aca3e47c366d9a229cc5e5b71ef55cb52efb77
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const doctorEmail = session?.user?.email;

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      fetchRequests(session.user.email);
    }
  }, [status, session]);

  const fetchRequests = async () => {
    try {
      setError(null);
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

  if (status === "loading") {
    return <div className="flex items-center justify-center min-h-screen text-xl">Loading...</div>;
  }

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <div
  style={{
    padding: "30px",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: darkMode ? "#121212" : "#FFFFFF", // Solid dark or white background
    color: darkMode ? "#FFFFFF" : "#000000", // Dynamic text color
  }}
>
 {/* Navbar */}
        <div className="w-full px-2 flex justify-between items-center">
          <div className="text-4xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-700 p-5">
            MediCare
          </div>
          <ul className="flex space-x-8 uppercase p-5">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/Messenger">Patients</Link></li>
            <li><Link href="/DoctorRequests">Verify Requests</Link></li>
            <li>
              <button onClick={() => signOut({ callbackUrl: "/" })}>Sign Out</button>
            </li>
            <button onClick={toggleDarkMode} className="flex items-center space-x-2 text-lg font-medium">
              {darkMode ? (
                <FaSun className="text-yellow-400" size={20} />
              ) : (
                <FaMoon className="text-blue-500" size={20} />
              )}
            </button>
          </ul>
        </div>

        {/* Content */}
        <h1 style={{ color: "#00698f", marginBottom: "20px", fontSize: "28px", fontWeight: "bold" }}>Doctor Requests</h1>
        {error && <p style={{ color: "red", marginBottom: "20px", fontSize: "16px", fontWeight: "bold" }}>Error: {error}</p>}

<<<<<<< HEAD
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
=======
        {/* Table */}
        <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 5, maxWidth: "800px", width: "100%" }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold", fontSize: "16px", backgroundColor: "#00698f", color: "#fff", textAlign: "center" }}>
                  Patient Email
>>>>>>> 86aca3e47c366d9a229cc5e5b71ef55cb52efb77
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: "16px", backgroundColor: "#00698f", color: "#fff", textAlign: "center" }}>
                  Status
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: "16px", backgroundColor: "#00698f", color: "#fff", textAlign: "center" }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {requests.map((req) => (
                <TableRow key={req._id}>
                  <TableCell>{req.patientEmail}</TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      textTransform: "capitalize",
                      fontSize: "14px",
                      textAlign: "center",
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
                      sx={{
                        margin: "5px",
                        padding: "8px 16px",
                        borderRadius: "8px",
                        fontSize: "14px",
                        fontWeight: "bold",
                        cursor: "pointer",
                        transition: "all 0.3s ease-in-out",
                        backgroundColor:
                          req.status === "accepted" ? "#4CAF50" : "#fff",
                        color:
                          req.status === "accepted" ? "#fff" : "#000",
                        border:
                          req.status === "accepted"
                            ? `2px solid #4CAF50`
                            : `2px solid #000`,
                      }}
                    >
                      Accept
                    </Button>
  

                    <Button
                      onClick={() => updateRequest(req.patientEmail, "rejected")}
                      sx={{
                        margin: "5px",
                        padding: "8px 16px",
                        borderRadius: "8px",
                        fontSize: "14px",
                        fontWeight: "bold",
                        cursor: "pointer",
                        transition: "all 0.3s ease-in-out",
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
    </ThemeProvider>
  );
};

export default DoctorRequests;

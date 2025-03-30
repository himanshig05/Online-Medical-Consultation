import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardContent,
  ThemeProvider,
  createTheme,
  CssBaseline,
} from "@mui/material";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { FaSun, FaMoon } from "react-icons/fa";
import { motion } from "framer-motion";
import { BASE_URL } from "../helper.js";
import PatientBell from "./patientBell";

const lightTheme = createTheme({
  palette: {
    mode: "light",
    background: { default: "#ffffff" },
    text: { primary: "#000000" },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: { default: "#121212" },
    text: { primary: "#ffffff" },
  },
});

const PatientNotifications = () => {
  const { data: session, status } = useSession();
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const patientEmail = session?.user?.email || "";

  useEffect(() => {
    if (status === "authenticated" && patientEmail) {
      fetchNotifications();
    }
  }, [status, patientEmail]);

  const fetchNotifications = async () => {
    try {
      setError(null);
      const response = await fetch(
        `${BASE_URL}/api/notifications/${patientEmail}`,
        {
          headers: { Accept: "application/json" },
        }
      );

      if (!response.ok)
        throw new Error(`Server Error: ${response.status} ${response.statusText}`);

      const data = await response.json();
      setNotifications(Array.isArray(data.notifications) ? data.notifications : []);
    } catch (err) {
      setError(err.message || "An unexpected error occurred");
    }
  };

  const markAsRead = async (doctorEmail) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/notifications/deleteNotification`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ patientEmail, doctorEmail }),
        }
      );

      if (!response.ok) throw new Error("Failed to delete notification");

      setNotifications((prev) =>
        prev.filter((notif) => notif.doctorEmail !== doctorEmail)
      );
    } catch (err) {
      setError(err.message || "An unexpected error occurred");
    }
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen text-xl">
        Loading...
      </div>
    );
  }

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <div
        className={`p-6 flex flex-col items-center min-h-screen transition-all ${
          darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
        }`}
      >
        {/* Header */}
<div className="w-full flex justify-between items-center mb-6">
  <div className="text-4xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-700 p-5">
    MediCare
  </div>

  <nav className="flex space-x-6 text-lg">
    <ul className="flex space-x-8 uppercase font-sans">
      <li className="text-lg font-medium">
        <Link href="/" className={darkMode ? "text-white" : "text-black"}>
          Home
        </Link>
      </li>
      <li className="text-lg font-medium">
        <Link href="/ListDoctors" className={darkMode ? "text-white" : "text-black"}>
          Find Doctors
        </Link>
      </li>
      <li className="text-lg font-medium">
        <Link href="/Messenger" className={darkMode ? "text-white" : "text-black"}>
          CHAT CONSULT
        </Link>
      </li>
      <li className="text-lg font-medium">
        <Link href={`/patientProfile/${patientEmail}`} className={darkMode ? "text-white" : "text-black"}>
          Profile
        </Link>
      </li>
      <li className="text-lg font-medium">
        <button onClick={() => signOut()} className={darkMode ? "text-white" : "text-black"}>
          SIGN OUT
        </button>
      </li>
      <li>
        <PatientBell patientEmail={patientEmail} />
      </li>
    </ul>
  </nav>

  {/* Dark Mode Toggle */}
  <button
    onClick={() => setDarkMode(!darkMode)}
    className="flex items-center space-x-2 text-lg font-medium transition-all"
  >
    {darkMode ? (
      <FaSun className="text-yellow-400" size={20} />
    ) : (
      <FaMoon className="text-blue-500" size={20} />
    )}
  </button>
</div>


        {/* Notifications Section */}
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-semibold"
        >
          My Notifications
        </motion.h2>

        {error && <p className="text-red-600 mt-2">{error}</p>}

        {/* Notification Cards */}
        <div className="w-full max-w-3xl mt-6 space-y-6">
          {notifications.length > 0 ? (
            notifications.map((notif) => (
              <motion.div
                key={notif._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Card sx={{ p: 5, borderRadius: 3, boxShadow: 5 }}>
                  <CardContent className="flex flex-col gap-3">
                    <p className="text-lg font-medium">
                      Dr. {notif.doctorEmail}{" "}
                      <span
                        className={`font-semibold ${
                          notif.new_status === "accepted"
                            ? "text-green-500"
                            : notif.new_status === "rejected"
                            ? "text-red-500"
                            : "text-blue-500"
                        }`}
                      >
                        {notif.new_status}
                      </span>{" "}
                      your request!{" "}
                      {notif.existing_status && (
                        <span className="text-gray-500 text-sm">
                          (Previously {notif.existing_status})
                        </span>
                      )}
                    </p>

                    {/* Display Time */}
                    <p className="text-sm text-gray-500">
                      {notif.createdAt
                        ? new Date(notif.createdAt).toLocaleString()
                        : "Unknown Date"}
                    </p>

                    <div className="flex gap-4">
                      <Link href={`/view_profile?email=${notif.doctorEmail}`}>
                        <Button variant="contained">View Profile</Button>
                      </Link>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => markAsRead(notif.doctorEmail)}
                      >
                        Mark as Read
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-lg">
              No notifications found!
            </motion.p>
          )}
        </div>
      </div>
    </ThemeProvider>
  );
};

export default PatientNotifications;

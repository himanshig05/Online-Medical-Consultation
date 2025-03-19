import React, { useState, useEffect } from "react";
import { Button, Card, CardContent } from "@mui/material";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { FaSun, FaMoon } from "react-icons/fa";
import { motion } from "framer-motion";
import { BASE_URL } from "../helper.js";
import PatientBell from "./patientBell"; // Ensure this component exists

const PatientNotifications = () => {
  const { data: session, status } = useSession();
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const patientEmail = session?.user?.email || "";

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      document.body.classList.toggle("dark", !prev);
      return !prev;
    });
  };

  useEffect(() => {
    if (status === "authenticated" && patientEmail) {
      fetchNotifications();
    }
  }, [status, patientEmail]);

  const fetchNotifications = async () => {
    try {
      setError(null);
      const response = await fetch(`${BASE_URL}/api/notifications/${patientEmail}`, {
        headers: { Accept: "application/json" },
      });

      if (!response.ok) throw new Error(`Server Error: ${response.status} ${response.statusText}`);

      const data = await response.json();
      setNotifications(Array.isArray(data.notifications) ? data.notifications : []);
    } catch (err) {
      setError(err.message || "An unexpected error occurred");
    }
  };

  const markAsRead = async (doctorEmail) => {
    try {
      const response = await fetch(`${BASE_URL}/api/notifications/deleteNotification`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patientEmail, doctorEmail }),
      });

      const text = await response.text();
      console.log("Raw response:", text);

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Invalid JSON response from server");
      }

      if (!response.ok) throw new Error(data.message || "Failed to delete notification");

      setNotifications((prev) => prev.filter((notif) => notif.doctorEmail !== doctorEmail));
    } catch (err) {
      console.error("Error deleting notification:", err.message);
      setError(err.message);
    }
  };

  if (status === "loading") {
    return <div className="flex items-center justify-center min-h-screen text-xl">Loading...</div>;
  }

  return (
    <div className="p-6 flex flex-col items-center min-h-screen bg-white dark:bg-gray-900">

      {/* Header */}
      <div className="w-full flex justify-between items-center mb-6">
      <div className="text-4xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-700 p-5">
      <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-extrabold text-blue-700 dark:text-white drop-shadow-lg"
        >
          MediCare
        </motion.h1>
              </div>
        

        <nav className="flex space-x-6 text-lg text-gray-700 dark:text-white">
          <ul className="flex space-x-8 uppercase p-5 font-sans">
            <li className="text-lg font-medium">
              <Link href="/">Home</Link>
            </li>
            <li className="text-lg font-medium">
              <Link href="/ListDoctors">Find Doctors</Link>
            </li>
            <li className="text-lg font-medium">
              <Link href="/Messenger">CHAT CONSULT</Link>
            </li>
            <li className="text-lg font-medium">
              <Link href={`/patientProfile/${patientEmail}`}>Profile</Link>
            </li>
            <li className="text-lg font-medium">
              <button onClick={() => signOut()}>SIGN OUT</button>
            </li>
            <li>
              <PatientBell patientEmail={patientEmail} />
            </li>
          </ul>
        </nav>
      </div>

      <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="text-2xl font-semibold text-gray-800 dark:text-white">
        My Notifications
      </motion.h2>

      {error && <p className="text-red-600 mt-2">{error}</p>}

      {/* Notification Cards */}
      <div className="w-full max-w-3xl mt-6 space-y-6">
        {notifications.length > 0 ? (
          notifications.map((notif) => (
            <motion.div key={notif._id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
              <Card className="p-5 shadow-xl rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 hover:scale-105 transition-all duration-300">
                <CardContent className="flex flex-col gap-3">
                  <p className="text-gray-900 dark:text-white text-lg font-medium">
                    Dr. {notif.doctorEmail}{" "}
                    <span className={`font-semibold ${notif.new_status === "accepted" ? "text-green-500" : notif.new_status === "rejected" ? "text-red-500" : "text-blue-500"}`}>
                      {notif.new_status}
                    </span>{" "}
                    your request!{" "}
                    {notif.existing_status && <span className="text-gray-500 text-sm"> (Previously {notif.existing_status})</span>}
                  </p>

                  {/* Display Time */}
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {notif.createdAt ? new Date(notif.createdAt).toLocaleString() : "Unknown Date"}
                  </p>

                  <div className="flex gap-4">
                    <Link href={`/view_profile?email=${notif.doctorEmail}`}>
                      <Button variant="contained" color="primary">
                        View Profile
                      </Button>
                    </Link>
                    <Button variant="contained" color="error" onClick={() => markAsRead(notif.doctorEmail)}>
                      Mark as Read
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        ) : (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-gray-500 py-4 text-lg">
            Data Loading !
          </motion.p>
        )}
      </div>
    </div>
  );
};

export default PatientNotifications;

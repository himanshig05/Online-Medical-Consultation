import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { BASE_URL } from "../../helper.js";
import { useSession, signOut } from "next-auth/react"; // Import signOut
import { FaMoon, FaSun } from "react-icons/fa"; // Importing the icons
import Link from "next/link";

const PrescriptionUpdateForm = () => {
  const { data: session } = useSession();
  const [date, setDate] = useState("");
  const [medicine, setMedicine] = useState("");
  const [duration, setDuration] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("active");
  const [darkMode, setDarkMode] = useState(false); // Dark mode state

  const router = useRouter();
  const { email, prescriptionId } = router.query;

  useEffect(() => {
    if (email && prescriptionId) {
      fetch(`${BASE_URL}/getPrescription/${prescriptionId}`)
        .then((res) => res.json())
        .then((data) => {
          setDate(data.date || "");
          setMedicine(data.medicine || "");
          setDuration(data.duration || "");
          setAmount(data.amount || "");
          setStatus(data.status || "active");
        })
        .catch((error) => console.error("Error fetching prescription:", error));
    }
  }, [email, prescriptionId]);

  const updatePrescription = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    const curr_user = session?.user?.email;
    fetch(`${BASE_URL}/editPrescription`, {
      method: "PATCH",
      body: JSON.stringify({
        email: email,
        curr_user: curr_user,
        prescriptionId: prescriptionId,
        date: date,
        medicine: medicine,
        duration: duration,
        amount: amount,
        status: status,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.edited) {
          alert("Prescription updated successfully!");
          router.push(`/patientProfile/${email}`);
        } else {
          alert(`Error: ${data.message}`);
        }
      })
      .catch((error) => {
        console.error("Error updating prescription:", error);
      });
  };

  return (
    <div className={darkMode ? "bg-gray-800 text-white" : "bg-white text-black"}>
      {/* Navbar */}
      <div className="flex justify-between items-center p-5">
        {/* Logo Section */}
        <div className="text-4xl font-semibold text-slate-800 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-700 p-5">
          MediCare
        </div>

        {/* Navbar Links & Dark Mode Toggle Section */}
        <div className="flex items-center space-x-8">
        <ul className={`flex space-x-8 p-5 ${darkMode ? 'text-white' : 'text-black'}`}>
            <li className="text-lg font-medium">
              <Link href="/">Home</Link>
            </li>
            <li className="text-lg font-medium">
              <Link href="/Messenger">PATIENTS</Link>
            </li>
            <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="text-lg font-medium"
          >
            SIGN OUT
          </button>
            {/* Add other links here */}
          </ul>

          {/* Dark Mode Toggle Button */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="flex items-center space-x-2 text-lg font-medium text-blue-700 hover:text-blue-500"
          >
            {darkMode ? (
              <FaSun className="text-yellow-400" size={20} />
            ) : (
              <FaMoon className="text-blue-500" size={20} />
            )}
          </button>

          {/* Sign Out Button */}
          
        </div>
      </div>

      <div className="flex items-center justify-center mt-24 mb-24">
        <div
          className={`px-16 py-10 border-2 w-1/2 ${
            darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"
          }`}
        >
          <div
            className={`font-semibold ${
              darkMode ? "text-white" : "text-black"
            } flex justify-center items-center mb-6 text-lg`}
          >
            Edit Prescription
          </div>

          <form onSubmit={updatePrescription}>
            <div className="mb-6">
              <label
                className={`block mb-2 text-sm font-medium ${
                  darkMode ? "text-gray-300" : "text-gray-900"
                }`}
              >
                Date:
              </label>
              <input
                className={`bg-gray-50 border ${
                  darkMode ? "border-gray-600 text-gray-300" : "border-gray-300 text-gray-900"
                } text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div className="mb-6">
              <label
                className={`block mb-2 text-sm font-medium ${
                  darkMode ? "text-gray-300" : "text-gray-900"
                }`}
              >
                Medicine:
              </label>
              <input
                className={`bg-gray-50 border ${
                  darkMode ? "border-gray-600 text-gray-300" : "border-gray-300 text-gray-900"
                } text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                type="text"
                value={medicine}
                onChange={(e) => setMedicine(e.target.value)}
              />
            </div>

            <div className="mb-6">
              <label
                className={`block mb-2 text-sm font-medium ${
                  darkMode ? "text-gray-300" : "text-gray-900"
                }`}
              >
                Duration:
              </label>
              <input
                className={`bg-gray-50 border ${
                  darkMode ? "border-gray-600 text-gray-300" : "border-gray-300 text-gray-900"
                } text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>

            <div className="mb-6">
              <label
                className={`block mb-2 text-sm font-medium ${
                  darkMode ? "text-gray-300" : "text-gray-900"
                }`}
              >
                Amount:
              </label>
              <input
                className={`bg-gray-50 border ${
                  darkMode ? "border-gray-600 text-gray-300" : "border-gray-300 text-gray-900"
                } text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            {/* Status field with radio buttons */}
            <div className="mb-6">
              <label
                className={`block mb-2 text-sm font-medium ${
                  darkMode ? "text-gray-300" : "text-gray-900"
                }`}
              >
                Status:
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="status"
                    value="active"
                    checked={status === "active"}
                    onChange={(e) => setStatus(e.target.value)}
                  />
                  <span className={darkMode ? "text-gray-300" : "text-gray-900"}>
                    Active
                  </span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="status"
                    value="completed"
                    checked={status === "completed"}
                    onChange={(e) => setStatus(e.target.value)}
                  />
                  <span className={darkMode ? "text-gray-300" : "text-gray-900"}>
                    Completed
                  </span>
                </label>
              </div>
            </div>

            <div className="mb-6 flex items-center justify-center">
              <button
                type="submit"
                className={`text-white ${
                  darkMode ? "bg-blue-500 hover:bg-blue-400" : "bg-blue-700 hover:bg-blue-800"
                } focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center`}
              >
                Edit Prescription
              </button>
            </div>

            <div className="flex items-center justify-center">
              <button
                className={`text-white ${
                  darkMode ? "bg-blue-500 hover:bg-blue-400" : "bg-blue-700 hover:bg-blue-800"
                } focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center`}
              >
                <Link href={`/patientProfile/${email}`}>Show Profile</Link>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionUpdateForm;

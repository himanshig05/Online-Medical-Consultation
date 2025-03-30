import React, { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { BASE_URL } from "../../helper.js";
import { FaMoon, FaSun } from "react-icons/fa";

const PrescriptionForm = () => {
  const { data: session } = useSession();
  const [date, setDate] = useState("");
  const [medicine, setMedicine] = useState("");
  const [duration, setDuration] = useState();
  const [amount, setAmount] = useState("");
  const router = useRouter();
  const email = router.query.email;
  const [darkMode, setDarkMode] = useState(false);

  const patientPrescription = (e) => {
    const curr_user = session.user.email;
    fetch(`${BASE_URL}/addPrescription/${email}`, {
      method: "PATCH",
      body: JSON.stringify({
        date: date,
        medicine: medicine,
        duration: duration,
        amount: amount,
        current: curr_user
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        alert("Created prescription");
        console.log("response from the backend, ", data);
        router.push(`/patientProfile/${email}`);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div
      className={darkMode ? "dark" : ""}
      style={{ backgroundColor: darkMode ? "#1a202c" : "#ffffff" }}
    >
      <div className="flex items-center justify-center">
        <Link href="/">
          <button
            className={`absolute top-4 left-4 font-semibold mb-4 px-4 py-2 rounded-lg transition-all ${
              darkMode
                ? "text-gray-100 bg-gray-800 hover:bg-gray-700"
                : "text-black bg-gray-200 hover:bg-gray-300"
            }`}
          >
            ← Back to Profile
          </button>
        </Link>
        <div
          className={`px-16 py-10 border-2 w-1/2 mt-24 mb-24 ${
            darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
          }`}
        >
          <div className="font-semibold flex justify-center items-center mb-6 text-lg">
            Add a Prescription
          </div>
          <div className="mb-6">
            <label className="block mb-2">
              Date:
            </label>
            <input
              className={`bg-gray-200 border border-gray-300 text-sm rounded-lg block w-full p-2.5 transition-all ${
                darkMode ? "bg-white text-black" : "bg-gray-200 text-black"
              }`}
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="block mb-2">
              Medicine:
            </label>
            <input
              className={`bg-gray-200 border border-gray-300 text-sm rounded-lg block w-full p-2.5 transition-all ${
                darkMode ? "bg-white text-black" : "bg-gray-200 text-black"
              }`}
              type="text"
              onChange={(e) => setMedicine(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="block mb-2">
              Duration:
            </label>
            <input
              className={`bg-gray-200 border border-gray-300 text-sm rounded-lg block w-full p-2.5 transition-all ${
                darkMode ? "bg-white text-black" : "bg-gray-200 text-black"
              }`}
              type="text"
              onChange={(e) => setDuration(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="block mb-2">
              Amount:
            </label>
            <input
              className={`bg-gray-200 border border-gray-300 text-sm rounded-lg block w-full p-2.5 transition-all ${
                darkMode ? "bg-white text-black" : "bg-gray-200 text-black"
              }`}
              type="text"
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div className="mb-6 flex items-center justify-center">
            <button
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
              onClick={(e) => patientPrescription(e)}
            >
              Add Prescription
            </button>
          </div>
          <div className="flex items-center justify-center">
            <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-9 py-2.5 text-center">
              <Link href={`/patientProfile/${email}`}>Show Profile</Link>
            </button>
          </div>
          <div className="absolute top-4 right-4">
            <button
              onClick={toggleDarkMode}
              className="flex items-center space-x-2 text-lg font-medium hover:text-blue-500"
            >
              {darkMode ? (
                <FaSun className="text-yellow-400" size={20} />
              ) : (
                <FaMoon className="text-blue-500" size={20} />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
  
};

export default PrescriptionForm;

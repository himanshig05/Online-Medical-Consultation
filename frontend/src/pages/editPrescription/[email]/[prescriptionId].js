import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { BASE_URL } from "../../../helper.js"; 
import { useSession } from "next-auth/react";

const PrescriptionUpdateForm = () => {
  const { data: session } = useSession();
  const [date, setDate] = useState("");
  const [medicine, setMedicine] = useState("");
  const [duration, setDuration] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("active"); // Default to "active"

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
          setStatus(data.status || "active"); // Ensure the status is set correctly
        })
        .catch((error) => console.error("Error fetching prescription:", error));
    }
  }, [email, prescriptionId]);

  const updatePrescription = () => {
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
    <div className="bg-white">
      <div className="flex items-center justify-center">
        <div className="bg-white px-16 py-10 border-2 w-1/2 mt-24 mb-24">
          <div className="font-semibold text-black flex justify-center items-center mb-6 text-lg">
            Edit Prescription
          </div>

          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-900">Date:</label>
            <input
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={{ color: "black" }}
            />
          </div>

          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-900">Medicine:</label>
            <input
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              type="text"
              value={medicine}
              onChange={(e) => setMedicine(e.target.value)}
              style={{ color: "black" }}
            />
          </div>

          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-900">Duration:</label>
            <input
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              style={{ color: "black" }}
            />
          </div>

          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-900">Amount:</label>
            <input
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={{ color: "black" }}
            />
          </div>

          {/* Status field with radio buttons */}
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-900">Status:</label>
            <div className="flex space-x-4">
              {/* "Active" radio button */}
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="status"
                  value="active"
                  checked={status === "active"}
                  onChange={(e) => setStatus(e.target.value)}
                />
                <span className="text-gray-900">Active (Currently in use)</span>
              </label>

              {/* "Completed" radio button */}
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="status"
                  value="completed"
                  checked={status === "completed"}
                  onChange={(e) => setStatus(e.target.value)}
                />
                <span className="text-gray-900">Completed (No longer in use)</span>
              </label>
            </div>
          </div>

          <div className="mb-6 flex items-center justify-center">
            <button
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
              onClick={updatePrescription}
            >
              Edit Prescription
            </button>
          </div>

          <div className="flex items-center justify-center">
            <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">
              <a href={`/patientProfile/${email}`}>Show Profile</a>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionUpdateForm;

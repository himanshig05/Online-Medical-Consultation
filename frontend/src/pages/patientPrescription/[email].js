import React, { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
const PrescriptionForm = () => {
  const { data: session } = useSession();
  const [date, setDate] = useState("");
    const [medicine, setMedicine] = useState("");
    const [duration, setDuration] = useState();
  const [amount, setAmount] = useState("");
  const router = useRouter();
  const email = router.query.email;
  const patientPrescription = (e) => {
    fetch(`http://127.0.0.1:5000/addPrescription/${email}`, {
      method: "PATCH",
      body: JSON.stringify({
          date: date,
          medicine: medicine,
          duration: duration,
          amount:amount,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        alert("Created prescription");
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
    router.push(`/patientProfile/${email}`);
  };

  return (
    <div className="bg-white">
      <div className="flex items-center justify-center">
        <div className=" bg-white px-16 py-10 border-2 w-1/2 mt-24 mb-24">
          <form method="post">
            <div className="font-semibold text-black flex justify-center items-center mb-6 text-lg">
              Create your Profile
            </div>
            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium text-gray-900">
                Date:{" "}
              </label>
              <input
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                onChange={(e) => {
                  setDate(e.target.value);
                }}
                type="text"
                name="name"
                style={{ color: "black" }}
              />
            </div>
            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium text-gray-900">
                Medicine:{" "}
              </label>
              <input
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                onChange={(e) => {
                  setMedicine(e.target.value);
                }}
                type="text"
                name="domain"
                style={{ color: "black" }}
              />
            </div>
            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium text-gray-900">
                Duration:{" "}
              </label>
              <input
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                onChange={(e) => {
                  setDuration(e.target.value);
                }}
                type="text"
                name="qualifications"
                style={{ color: "black" }}
              />
            </div>
            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium text-gray-900">
                Amount:{" "}
              </label>
              <input
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                onChange={(e) => {
                  setAmount(e.target.value);
                }}
                type="text"
                name="location"
                style={{ color: "black" }}
              />
            </div>
            <div className="mb-6 flex items-center justify-center">
              <button
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                onClick={(e) => {
                  patientPrescription(e);
                }}
                type="submit"
                
              >
                Add Prescription
              </button>
            </div>
            <div className="flex items-center justify-center">
            <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-9 py-2.5 text-center">
              <Link href={`/patientProfile/${email}`}>Show Profile</Link>
            </button>
          </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionForm;

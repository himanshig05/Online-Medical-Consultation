import React, { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
const PatientUpdateForm = () => {
  const { data: session } = useSession();
  const [name, setName] = useState("");
  const [age, setAge] = useState();
  const [gender, setGender] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [conditions, setConditions] = useState("");
  const router = useRouter();

  const patientUpdate = (e) => {
    const email = router.query.email;
    fetch(`http://127.0.0.1:5000/patientUpdate/${email}`, {
      method: "POST",
      body: JSON.stringify({
        email: email,
        name: name,
        age: age,
        gender: gender,
        height: height,
        weight: weight,
        bloodGroup: bloodGroup,
        conditions: conditions,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        alert("Updated profile");
        console.log(data);
      })
      .catch((error) => {
        alert("Error");
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
              Edit your Profile
            </div>
            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium text-gray-900">
                Name:{" "}
              </label>
              <input
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                onChange={(e) => {
                  setName(e.target.value);
                }}
                type="text"
                name="name"
                style={{ color: "black" }}
              />
            </div>
            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium text-gray-900">
                Age:{" "}
              </label>
              <input
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                onChange={(e) => {
                  setAge(e.target.value);
                }}
                type="number"
                name="age"
                style={{ color: "black" }}
              />
            </div>
            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium text-gray-900">
                Gender:{" "}
              </label>
              <input
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                onChange={(e) => {
                  setGender(e.target.value);
                }}
                type="text"
                name="domain"
                style={{ color: "black" }}
              />
            </div>
            <label className="block mb-2 text-sm font-medium text-gray-900">
              Height:{" "}
            </label>
            <input
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              onChange={(e) => {
                setHeight(e.target.value);
              }}
              type="number"
              name="experience"
              style={{ color: "black" }}
            />
            <label className="block mb-2 text-sm font-medium text-gray-900">
              Weight:{" "}
            </label>
            <input
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              onChange={(e) => {
                setWeight(e.target.value);
              }}
              type="number"
              name="experience"
              style={{ color: "black" }}
            />
            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium text-gray-900">
                Blood Group:{" "}
              </label>
              <input
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                onChange={(e) => {
                  setBloodGroup(e.target.value);
                }}
                type="text"
                name="qualifications"
                style={{ color: "black" }}
              />
            </div>
            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium text-gray-900">
                Conditions:{" "}
              </label>
              <input
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                onChange={(e) => {
                  setConditions(e.target.value);
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
                  patientUpdate(e);
                }}
                type="submit"
                style={{ backgroundColor: "white", color: "black" }}
              >
                Add Details
              </button>
            </div>
          </form>
          <div className="flex items-center justify-center">
            <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">
              <Link href={`/patientProfile/${session.user.email}`}>Show Profile</Link>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientUpdateForm;

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import axios from "axios";
import { BASE_URL } from "../../helper.js";

const EditForm = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const email = router.query.email;

  const [doctor, setDoctor] = useState(null);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [domain, setDomain] = useState("");
  const [experience, setExperience] = useState("");
  const [qualifications, setQualifications] = useState("");
  const [location, setLocation] = useState("");
  const [hours, setHours] = useState("");
  const [profilePic, setProfilePic] = useState("");

  // Fetch doctor's info when the page loads
  useEffect(() => {
    if (!router.isReady || !email) return;
    fetch(`${BASE_URL}/search/${email}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch data");
        return res.json();
      })
      .then((data) => {
        setDoctor(data);
        setName(data.name || "");
        setAge(data.age || "");
        setDomain(data.domain || "");
        setExperience(data.experience || "");
        setQualifications(data.qualifications || "");
        setLocation(data.location || "");
        setHours(data.hours || "");
      })
      .catch((error) => console.error("Error fetching doctor:", error));
  }, [router.isReady, email]);

  const updateDoctor = async (e) => {
    e.preventDefault();
    const updatedData = {
      email: email,
      name: name || doctor?.name,
      age: age || doctor?.age,
      domain: domain || doctor?.domain,
      experience: experience || doctor?.experience,
      qualifications: qualifications || doctor?.qualifications,
      location: location || doctor?.location,
      hours: hours || doctor?.hours,
    };

    try {
      const response = await fetch(`${BASE_URL}/update/${email}`, {
        method: "POST",
        body: JSON.stringify(updatedData),
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to update profile");
      alert("Profile Updated");
      router.push(`/findDoctor/${email}`);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (!doctor) return <p className="text-center text-gray-700">Loading...</p>;

  return (
    <div className="bg-white">
      <div className="flex items-center justify-center">
        <div className="bg-white px-16 py-10 border-2 w-1/2 mt-24 mb-24">
          <h2 className="font-semibold text-black flex justify-center items-center mb-6 text-lg">
            Edit your Profile
          </h2>
          <form onSubmit={updateDoctor}>
            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium text-gray-900">Name:</label>
              <input
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
              />
            </div>
            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium text-gray-900">Age:</label>
              <input
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                type="number"
              />
            </div>
            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium text-gray-900">Domain:</label>
              <input
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                type="text"
              />
            </div>
            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium text-gray-900">Experience:</label>
              <input
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                type="number"
              />
            </div>
            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium text-gray-900">Qualifications:</label>
              <input
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                value={qualifications}
                onChange={(e) => setQualifications(e.target.value)}
                type="text"
              />
            </div>
            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium text-gray-900">Location:</label>
              <input
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                type="text"
              />
            </div>
            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium text-gray-900">Available Hours:</label>
              <input
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                type="text"
              />
            </div>
            <div className="mb-6 flex items-center justify-center">
              <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">
                Submit
              </button>
            </div>
          </form>
          <div className="flex items-center justify-center">
            <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">
              <Link href={`/findDoctor/${session?.user.email}`}>Show Profile</Link>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditForm;

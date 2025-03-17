import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import axios from "axios";
import { BASE_URL } from "../../helper.js";
import app from "../../firebase.js";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

const EditForm = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const email = router.query.email;

  const [doctor, setDoctor] = useState({});
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [domain, setDomain] = useState("");
  const [experience, setExperience] = useState("");
  const [qualifications, setQualifications] = useState("");
  const [location, setLocation] = useState("");
  const [hours, setHours] = useState("");
  const [profilePic, setProfilePic] = useState("");

  useEffect(() => {
    if (router.isReady) {
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
        .catch((error) => console.error(error));
    }
  }, [router.isReady]);

  const updateDoctor = async (e) => {
    const image = profilePic;
    if (!image) {
      fetch(`${BASE_URL}/update/${email}`, {
        method: "POST",
        body: JSON.stringify({
          email: email,
          name: name || undefined,
          age: age || undefined,
          domain: domain || undefined,
          experience: experience || undefined,
          qualifications: qualifications || undefined,
          location: location || undefined,
          hours: hours || undefined,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          alert("Profile updated");
          router.push(`/findDoctor/${email}`);
          console.log(data);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      const formData = new FormData();
      formData.append("file", image);
      formData.append("upload_preset", "MediCare");

      try {
        const response = await axios.post(
          "https://api.cloudinary.com/v1_1/ddenfqz4u/image/upload",
          formData
        );
        if (!response.data.secure_url) {
          throw new Error("Cloudinary upload failed");
        }
        const cloudinaryUrl = response.data.secure_url;
        fetch(`${BASE_URL}/update/${email}`, {
          method: "POST",
          body: JSON.stringify({
            email: email,
            name: name || undefined,
            age: age || undefined,
            domain: domain || undefined,
            experience: experience || undefined,
            qualifications: qualifications || undefined,
            location: location || undefined,
            hours: hours || undefined,
            picturePath: cloudinaryUrl,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((res) => res.json())
          .then((data) => {
            alert("Profile updated");
            router.push(`/findDoctor/${email}`);
            console.log(data);
          })
          .catch((error) => {
            console.log(error);
          });
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  return (
    <div className="bg-white">
      <div className="flex items-center justify-center">
        <div className="bg-white px-16 py-10 border-2 w-1/2 mt-24 mb-24">
          <div className="font-semibold text-black flex justify-center items-center mb-6 text-lg">
            Edit your Profile
          </div>

          {/* Name */}
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-900">Name:</label>
            <input
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              onChange={(e) => setName(e.target.value)}
              type="text"
              value={name}
            />
          </div>

          {/* Age */}
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-900">Age:</label>
            <input
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              onChange={(e) => setAge(e.target.value)}
              type="number"
              value={age}
            />
          </div>

          {/* Domain */}
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-900">Domain:</label>
            <input
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              onChange={(e) => setDomain(e.target.value)}
              type="text"
              value={domain}
            />
          </div>

          {/* Experience */}
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-900">Experience:</label>
            <input
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              onChange={(e) => setExperience(e.target.value)}
              type="number"
              value={experience}
            />
          </div>

          {/* Qualifications */}
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-900">Qualifications:</label>
            <input
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              onChange={(e) => setQualifications(e.target.value)}
              type="text"
              value={qualifications}
            />
          </div>

          {/* Location */}
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-900">Location:</label>
            <input
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              onChange={(e) => setLocation(e.target.value)}
              type="text"
              value={location}
            />
          </div>

          {/* Hours */}
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-900">Available Hours:</label>
            <input
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              onChange={(e) => setHours(e.target.value)}
              type="text"
              value={hours}
            />
          </div>
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-900">
              Profile Picture:
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setProfilePic(e.target.files[0])}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />
          </div>

          {profilePic && (
            <div className="mb-6 flex justify-center">
              <img
                src={URL.createObjectURL(profilePic)}
                alt="Profile Preview"
                className="w-32 h-32 object-cover"
              />
            </div>
          )}

          <div className="mb-6 flex items-center justify-center">
            <button
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
              onClick={updateDoctor}
            >
              Submit
            </button>
          </div>

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

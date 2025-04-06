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
import { FaMoon, FaSun } from "react-icons/fa";

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
  const [darkMode, setDarkMode] = useState(false);

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

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
    document.documentElement.classList.toggle("dark");
  };

 
  return (
    <div className={`min-h-screen transition-all ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`}> 
      <div className="flex items-center justify-center">
        
        <Link href="/">
      <button
        className={`absolute top-4 left-4 font-semibold mb-4 px-4 py-2 rounded-lg transition-all ${
          darkMode ? "text-gray-100 bg-gray-800 hover:bg-gray-700" : "text-black bg-gray-200 hover:bg-gray-300"
        }`}
      >
        ← Back to  Profile
      </button>
    </Link>
        <div className={`px-16 py-10 border-2 w-1/2 mt-24 mb-24 transition-all ${darkMode ? "bg-gray-800 border-gray-600" : "bg-white border-gray-300"}`}> <div className="font-semibold flex justify-center items-center mb-6 text-lg">Edit your Profile</div>
          

          {/* Name */}
          <div className="mb-6">
            <label className="block mb-2 text-white:text-black">Name:</label>
            <input
            className="bg-gray-200 dark:bg-white border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-all"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          </div>

          {/* Age */}
          <div className="mb-6">
            <label className="block mb-2 text-white:text-black">Age:</label>
            <input
              className="bg-gray-200 dark:bg-white border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-all"
             
               onChange={(e) => setAge(e.target.value)}
              type="number"
              value={age}
            />
          </div>

          {/* Domain */}
          <div className="mb-6">
            <label className="block mb-2 text-white:text-black">Domain:</label>
            <input
             className="bg-gray-200 dark:bg-white border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-all"
             onChange={(e) => setDomain(e.target.value)}
              type="text"
              value={domain}
            />
          </div>

          {/* Experience */}
          <div className="mb-6">
            <label className="block mb-2 text-white:text-black">Experience:</label>
            <input
             className="bg-gray-200 dark:bg-white border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-all"
             onChange={(e) => setExperience(e.target.value)}
              type="number"
              value={experience}
            />
          </div>

          {/* Qualifications */}
          <div className="mb-6">
            <label className="block mb-2 text-white:text-black">Qualifications:</label>
            <input
             className="bg-gray-200 dark:bg-white border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-all"
             onChange={(e) => setQualifications(e.target.value)}
              type="text"
              value={qualifications}
            />
          </div>

          {/* Location */}
          <div className="mb-6">
            <label className="block mb-2 text-white:text-black">Location:</label>
            <input
             className="bg-gray-200 dark:bg-white border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-all"
             onChange={(e) => setLocation(e.target.value)}
              type="text"
              value={location}
            />
          </div>

          {/* Hours */}
          <div className="mb-6">
            <label className="block mb-2 text-white:text-black">Available Hours:</label>
            <input
             className="bg-gray-200 dark:bg-white border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-all"
             onChange={(e) => setHours(e.target.value)}
              type="text"
              value={hours}
            />
          </div>

          {/* Profile Picture */}
          <div className="mb-6">
            <label className="block mb-2 text-white:text-black">Profile Picture:</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setProfilePic(e.target.files[0])}
              className="bg-gray-200 dark:bg-white border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-all"
              />
          </div>

          {profilePic && (
            <div className="mb-6 flex justify-center">
              <img
                src={URL.createObjectURL(profilePic)}
                alt="Profile Preview"
                className="w-32 h-32 object-cover rounded-lg"
              />
            </div>
          )}

          <div className="mb-6 flex items-center justify-center">
            <button
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center transition-all"
              onClick={updateDoctor}
            >
              Submit
            </button>
          </div>

          <div className="flex items-center justify-center">
            <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center transition-all">
              <Link href={`/findDoctor/${session?.user.email}`}>Show Profile</Link>
            </button>
          </div>

          {/* Dark Mode Toggle Button */}
          <div className="absolute top-4 right-4">
            <button onClick={toggleDarkMode} className="flex items-center space-x-2 text-lg font-medium text-blue-700 dark:text-gray-100 hover:text-blue-500 transition-all">
              {darkMode ? <FaSun className="text-yellow-400" size={20} /> : <FaMoon className="text-blue-500" size={20} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditForm;

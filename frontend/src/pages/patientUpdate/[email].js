import React, { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { BASE_URL } from "../../helper.js"; 
import app from "../../firebase.js";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
const PatientUpdateForm = () => {
  const { data: session } = useSession();
  const [name, setName] = useState("");
  const [age, setAge] = useState();
  const [gender, setGender] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [conditions, setConditions] = useState("");
  const [profilePic, setprofilePic]=useState(null);
  const router = useRouter();
  const email = router.query.email;
  
  
  const patientUpdate=async(e)=>{
    const image=profilePic;
    if(!image)
    {
      fetch(`${BASE_URL}/patientUpdate/${email}`, {
              method: "POST",
              body: JSON.stringify({
                email: email,
        name: name || undefined,  
        age: age || undefined,
        gender: gender || undefined,
        height: height || undefined,
        weight: weight||undefined,
        bloodGroup: bloodGroup || undefined,
        conditions: conditions || undefined,
              }),
              headers: {
                "Content-Type": "application/json",
              },
            })
              .then((res) => res.json())
              .then((data) => {
                alert("Updated profile");
                 router.push(`/patientProfile/${email}`);
                console.log(data);
              })
              .catch((error) => {
                console.log(error);
              });
    }
    else{
    const fileName = new Date().getTime() + image.name;
        const storage = getStorage(app);
        const StorageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(StorageRef, image);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
            }
          },
          (error) => {
            console.group(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              fetch(`${BASE_URL}/patientUpdate/${email}`, {
                method: "POST",
                body: JSON.stringify({
                  email: email,
        name: name || undefined,  
        age: age || undefined,
        gender: gender || undefined,
        height: height || undefined,
        weight: weight||undefined,
        bloodGroup: bloodGroup || undefined,
        conditions: conditions || undefined,
                  picturePath: downloadURL,
                }),
                headers: {
                  "Content-Type": "application/json",
                },
              })
                .then((res) => res.json())
                .then((data) => {
                  alert("Updated profile");
                   router.push(`/patientProfile/${email}`);
                  console.log(data);
                })
                .catch((error) => {
                  alert("Error");
                  console.log(error);
                });
            });
          }
        );
      }
    };
  
  

  
  return (
    <div className="bg-white">
      <div className="flex items-center justify-center">
        <div className=" bg-white px-16 py-10 border-2 w-1/2 mt-24 mb-24">
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
            <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-900">
              Profile Picture:
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setprofilePic(e.target.files[0])}
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
                onClick={(e) => {
                  patientUpdate(e);
                }}
              >
                Edit Details
              </button>
            </div>
          <div className="flex items-center justify-center">
            <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">
              <Link href={`/patientProfile/${email}`}>Show Profile</Link>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientUpdateForm;



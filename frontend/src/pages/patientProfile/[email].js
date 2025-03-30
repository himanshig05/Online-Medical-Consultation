import React, { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";
import { BASE_URL } from "../../helper.js";
import { FaMoon, FaSun } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const PatientProfile = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [patient, setPatient] = useState({});
  const email = router.query.email;
  const [darkMode, setDarkMode] = useState(false);

  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     const savedTheme = localStorage.getItem("theme") || "light";
  //     setTheme(savedTheme);
  //   }
  // }, []);

  // useEffect(() => {
  //   localStorage.setItem("theme", theme);
  // }, [theme]);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
    document.documentElement.classList.toggle("dark");
  };

  useEffect(() => {
    if (router.isReady && email) {
      fetch(`${BASE_URL}/patientProfile/${email}`)
        .then((res) => res.json())
        .then((data) => {
          setPatient(data);
        })
        .catch((err) => console.error("Failed to fetch patient data:", err));
    }
  }, [router.isReady, email]);

  const handleDelete = async (prescriptionId) => {
    fetch(`${BASE_URL}/deletePrescription`, {
      method: "PATCH",
      body: JSON.stringify({ email, prescriptionId, curr_user: session.user.email }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.deleted) {
          alert("Deleted prescription");
          setPatient((prev) => ({
            ...prev,
            prescriptions: prev.prescriptions.filter((p) => p._id !== prescriptionId),
          }));
        } else {
          alert("You cannot delete this prescription!");
        }
      })
      .catch((error) => console.error("Error deleting prescription:", error));
  };

  const handleEdit = async (prescriptionId) => {
    router.push(`/editPrescription/${email}/${prescriptionId}`);
  };

  if (!patient) {
    return (
      <div className={darkMode ? "dark" : ""}>
    
        <div className={`dark:bg-gray-900 bg-white flex flex-col w-full h-screen`}>
          <div className="flex justify-center">
            <img
              src="/doctor_team.png"
              style={{ width: "600px", height: "500px" }}
            />
          </div>
          <div className="text-[#2f0563] font-bold justify-center flex text-5xl mt-6 dark:text-white">
            Create Profile to track your Medical History!
          </div>
          <div className="flex justify-center mt-8 text-lg hover:scale-[1.01] duration-500">
            <Link
              href={`/patientCreate/${email}`}
              className="bg-red-500 text-white p-4 rounded-md"
            >
              Create Profile
            </Link>
          </div>
        </div>
      </div>
    );
  }

 
  return (
    <div className={`dark:bg-gray-900 bg-white flex flex-col w-full h-screen`}>
      {/* Navigation Bar with Toggle Button */}
      <div className="w-full px-2 bg-white dark:bg-gray-800 flex justify-between items-center">
        <div className="flex justify-between">
          <div className="text-4xl font-semibold text-slate-800 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-700 p-5 dark:text-white">
            MediCare
          </div>
        </div>
        {session?.user.email === email ? (
          <div className="flex justify-center">
            <ul className="flex justify-between space-x-8 text-black dark:text-white uppercase p-5 mr-12">
              <li className="text-lg font-medium ml-10">
                <Link href="/">Home</Link>
              </li>
              <li className="text-lg font-medium ml-10">
                <Link href="/ListDoctors">Find Doctors</Link>
              </li>
              <li className="text-lg font-medium ml-10">
                <Link href="/Messenger">Chat Consult</Link>
              </li>
              <li className="text-lg font-medium ml-10">
                <a href={`/patientProfile/${session?.user?.email}`}>Profile</a>
              </li>
              <li className="text-lg font-medium ml-10">
                <button onClick={() => signOut({ callbackUrl: "/" })}>
                  SIGN OUT
                </button>
              </li>
              {/* Theme Toggle Button */}
              <li className="ml-10">
              <button onClick={toggleDarkMode} className="flex items-center space-x-2 text-lg font-medium text-blue-700 hover:text-blue-500">
          {darkMode ? <FaSun className="text-yellow-400" size={20} /> : <FaMoon className="text-blue-500" size={20} />}
        </button>
              </li>
            </ul>
          </div>
        ) : (
          <div className="flex justify-center">
            <ul className="flex justify-between space-x-8 text-black dark:text-white uppercase p-5 mr-12">
              <li className="text-lg font-medium ml-10">
                <Link href="/">Home</Link>
              </li>
              <li className="text-lg font-medium ml-10">
                <Link href="/Messenger">Patients</Link>
              </li>
              <li className="text-lg font-medium ml-10">
                <button onClick={() => signOut({ callbackUrl: "/" })}>
                  SIGN OUT
                </button>
              </li>
              {/* Theme Toggle Button */}
              <li className="ml-10">
              <button onClick={toggleDarkMode} className="flex items-center space-x-2 text-lg font-medium text-blue-700 hover:text-blue-500">
    {darkMode ? <FaSun className="text-yellow-400" size={20} /> : <FaMoon className="text-blue-500" size={20} />}
  </button>
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Profile Section */}
      <div className="bg-gray-100 dark:bg-gray-800 w-full h-full">
        <div className="bg-white dark:bg-gray-700 rounded-b-3xl h-full left-0 overflow-x-hidden pt-5 absolute top-[80px] w-[250px]">
          <div className="flex justify-center items-center flex-col">
            <div>
              <img
                className=""
                src={patient.picturePath}
                style={{ width: "200px", height: "200px" }}
              />
              <div className="text-black text-xl font-bold pt-5 text-center dark:text-white">
                {patient.name}
              </div>
            </div>
            <div className="text-center mt-4 space-y-4">
              {session?.user?.email === email && (
                <div className="text-white font-bold py-2 px-4 text-xl border-2 rounded-xl bg-blue-500 hover:bg-blue-700 text-center">
                  <Link href={`/patientUpdate/${patient.email}`}>Edit Details</Link>
                </div>
              )}
              <div className="text-white font-bold py-2 px-4 text-xl border-2 rounded-xl bg-blue-500 hover:bg-blue-700 text-center">
                <Link href={`/patientPrescription/${patient.email}`}>
                  Add Prescription
                </Link>
              </div>
              {(() => {
                const isPecEmail = session?.user?.email?.endsWith("@pec.edu.in");
                console.log("Email ends with @pec.edu.in:", isPecEmail);
                return isPecEmail ? (
                  <div className="text-white font-bold py-2 px-4 text-xl border-2 rounded-xl bg-blue-500 hover:bg-blue-700 text-center">
                    <Link href={`/uploadDocument/${patient.email}`}>
                      Add Document
                    </Link>
                  </div>
                ) : (
                  <div className="text-white font-bold py-2 px-4 text-xl border-2 rounded-xl bg-blue-500 hover:bg-blue-700 text-center">
                    <Link href="/PatientDocuments">
                      View Documents
                    </Link>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Details */}
      <div className="ml-[29%] text-2xl px-10 w-[58%]">
        <h2 className="text-black pt-8 text-3xl font-sans mb-2.5 font-bold flex justify-center dark:text-white">
          Profile Details
        </h2>
        <div className="bg-white dark:bg-gray-700 rounded-3xl shadow-xl shadow-gray-500 pt-5 pb-5 pl-12 mb-5 mt-8">
          <table className="border-none text-base h-[370px] w-[80%] text-black dark:text-white">
            <tbody>
              <tr>
                <td className="font-semibold italic">Name</td>
                <td>:</td>
                <td>{patient.name}</td>
              </tr>
              <tr>
                <td className="font-semibold italic">Age</td>
                <td>:</td>
                <td>{patient.age} years</td>
              </tr>
              <tr>
                <td className="font-semibold italic">Gender</td>
                <td>:</td>
                <td>{patient.gender}</td>
              </tr>
              <tr>
                <td className="font-semibold italic">Height</td>
                <td>:</td>
                <td>{patient.height}</td>
              </tr>
              <tr>
                <td className="font-semibold italic">Weight</td>
                <td>:</td>
                <td>{patient.weight}</td>
              </tr>
              <tr>
                <td className="font-semibold italic">Blood Group</td>
                <td>:</td>
                <td>{patient.bloodGroup}</td>
              </tr>
              <tr>
                <td className="font-semibold italic">Conditions</td>
                <td>:</td>
                <td>{patient.conditions}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-black dark:text-white text-3xl flex justify-center font-bold mt-8">
        Current Medications
      </div>
      {patient.prescriptions?.length > 0 ? (
        patient.prescriptions?.map((p) => (
          <div
            key={p._id}
            className="bg-white dark:bg-gray-800 rounded-3xl border-red-400 pt-5 pl-12 mb-5 pb-5 mt-8"
          >
            <div className="relative flex flex-row items-start space-x-20">
              <div>
                <img src="/download.jpeg" alt="Medicine" />
              </div>
              <table className="border-none text-base h-[270px] w-[80%] text-black dark:text-white">
                <tbody>
                  <tr>
                    <td className="font-semibold">Date</td>
                    <td>:</td>
                    <td>{p.date}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold">Medicine</td>
                    <td>:</td>
                    <td>{p.medicine}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold">Duration</td>
                    <td>:</td>
                    <td>{p.duration}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold">Amount</td>
                    <td>:</td>
                    <td>{p.amount}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold">Status</td>
                    <td>:</td>
                    <td>
                      <span
                        className={`px-3 py-1 rounded-lg font-bold ${p.status === "active"
                          ? "bg-green-500 text-white"
                          : p.status === "pending"
                            ? "bg-yellow-500 text-black"
                            : "bg-blue-500 text-white"
                          }`}
                      >
                        {p.status}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="flex space-x-4 absolute top-5 right-5">
                {p.doctor === session?.user?.email && (
                  <button
                    className="inline-flex items-center px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md"
                    onClick={() => handleDelete(p._id)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Delete
                  </button>
                )}
                {p.doctor === session?.user?.email && (
                  <button
                    className="inline-flex items-center px-5 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md"
                    onClick={() => handleEdit(p._id)}
                  >
                    Edit
                  </button>
                )}
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="bg-gray-100 dark:bg-gray-700 flex justify-center p-8 h-[250px]">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 w-[700px] flex justify-center text-black dark:text-white">
            No prescriptions found
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientProfile;

import React, { useState, useEffect } from "react"; 
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/router.js";
import Patient_Login from "@/pages/Patient_Login";
import { FaMoon, FaSun } from "react-icons/fa";

const LoginPage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [darkMode, setDarkMode] = useState(false);

  // 🌙 Load dark mode preference from localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedMode);
    if (savedMode) {
      document.documentElement.classList.add("dark");  // ✅ Apply to HTML
    }
  }, []);

  // 🌙 Toggle Dark Mode
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", newMode.toString());

    if (newMode) {
      document.documentElement.classList.add("dark");  // ✅ Apply dark mode
    } else {
      document.documentElement.classList.remove("dark");  // ❌ Remove dark mode
    }
  };

  if (session) {
    const emailId = session.user.email;
    const check = emailId.slice(emailId.indexOf("@"));
    if (check === "@pec.edu.in") {
      router.push(`/findDoctor/${emailId}`);
      return null;
    }
    return <Patient_Login />;
  }

  return (
    <>
      <div className={`flex h-screen w-full ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-black"}`}>
        
        {/* 🔹 Dark Mode Button (Top Right Corner) */}
        <div className="absolute top-4 right-6">
        <button
  onClick={toggleDarkMode}
  className="p-2 rounded-full border border-gray-500 hover:bg-gray-700 z-50 fixed top-4 right-6 pointer-events-auto"
>
  {darkMode ? <FaSun className="text-yellow-400" size={24} /> : <FaMoon className="text-gray-600" size={24} />}
</button>

        </div>

        <div className="flex w-full h-screen items-center justify-center lg:w-1/2">
          <div className={`px-12 py-20 border-2 ${darkMode ? "bg-gray-800 border-white" : "bg-white border-purple-500"}`}>
            
            <div className="flex justify-center items-center">
              <h1 className="text-6xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-700">
                MediCare
              </h1>
            </div>

            <div className="flex justify-center items-center">
              <p className={`text-2xl font-semibold bg-clip-text text-transparent ${darkMode ? "bg-gradient-to-r from-gray-400 to-gray-600" : "bg-gradient-to-r from-sky-400 to-blue-700"}`}>
                Modernizing Medication
              </p>
            </div>

            <div className="flex flex-col gap-4 items-center">
              <div className="m-10 mt-14 text-lg hover:scale-[1.05] duration-500">
                <button
                  onClick={() => signIn()}
                  className={`py-4 px-20 rounded-md border-2 font-bold ${darkMode ? "bg-gray-700 text-white border-gray-500 hover:border-gray-400" : "bg-gradient-to-r from-blue-400 to-purple-700 text-white border-transparent hover:border-indigo-700"}`}
                >
                  Login as Patient
                </button>
              </div>

              <div className="mx-10 text-lg hover:scale-[1.05] duration-500">
                <button
                  onClick={() => signIn()}
                  className={`py-4 px-20 rounded-md border-2 font-bold ${darkMode ? "bg-gray-700 text-white border-gray-500 hover:border-gray-400" : "bg-gradient-to-r from-blue-400 to-purple-700 text-white border-transparent hover:border-indigo-700"}`}
                >
                  Login as Doctor
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex w-1/2 relative items-center justify-center">
          <img src="bg1.gif" alt="" style={{ width: "768px", height: "500px" }} />
        </div>
      </div>
    </>
  );
};

export default LoginPage;

import React, { useState, useEffect } from "react"; 
import { FaMoon, FaSun } from "react-icons/fa";
import Service1 from "../components/Patient_Service1";
import Service2 from "../components/Patient_Service2";
import Service3 from "../components/Patient_Service3";
import HelpChat from "@/components/HelpChat";
import HelpButton from "@/components/HelpButton";
import { signOut, useSession } from "next-auth/react";
import LoginPage from "../components/LoginPage.jsx";
import Link from "next/link";
import { useTheme } from "../../context/ThemeContext";
import PatientBell from "./patientBell";
import PatientDocuments from "./PatientDocuments";

const Patient_Login = () => {
  const { data: session } = useSession();
  const [showPopup, setShowPopup] = useState(false); 
  const [theme, setTheme] = useState("light");

useEffect(() => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    setTheme(savedTheme);
  }
}, []);

useEffect(() => {
  localStorage.setItem("theme", theme);
}, [theme]);

const toggleTheme = () => {
  const newTheme = theme === "light" ? "dark" : "light";
  setTheme(newTheme);
  localStorage.setItem("theme", newTheme);
  document.documentElement.classList.toggle("dark", newTheme === "dark");
}

  if (session) {
    return (
      <>
        <div className={`w-full h-screen ${theme === "dark" ? "bg-gray-900 text-white" : "bg-slate-50 text-black"}`}>
          {/* Navbar */}
          <div className={`w-full px-2 flex justify-between items-center ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"} shadow-md py-4`}>
            <div className="flex">
            <img 
  src="/MEDICARE.png" 
  alt="Logo" 
  className="w-16 h-16" 
  style={{ width: "65px" }} 
/>

              <div className="text-4xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-700 p-5">
                MediCare
              </div>
            
            </div>

            <div className="flex items-center">
              <ul className="flex space-x-8 uppercase p-5 font-sans">
                <li className="text-lg font-medium">
                  <Link href="/">Home</Link>
                </li>
                <li className="text-lg font-medium">
                  <Link href="/ListDoctors">Find Doctors</Link>
                </li>
                <li className="text-lg font-medium">
                  <Link href="/Messenger">CHAT CONSULT</Link>
                </li>
                <li className="text-lg font-medium">
                  <Link href={`/patientPayments/${session?.user?.email}`}>
                    Payments
                  </Link>
                </li>
                <li className="text-lg font-medium">
                  <Link href={`/patientProfile/${session?.user?.email}`}>
                    Profile
                  </Link>
                </li>
                <li className="text-lg font-medium">
                  <button onClick={() => signOut()}>SIGN OUT</button>
                </li>
                <li>
                <PatientBell patientEmail={session?.user?.email} />

                </li>
                {/* <li>
                <Link href="/PatientDocuments">View Documents</Link>

                </li> */}
              </ul>

              {/* Dark Mode Toggle Button */}
              <button
                className="ml-5 p-2 text-lg rounded-full transition-all hover:scale-110"
                onClick={toggleTheme} // ✅ Fixed Here
              >
                {theme === "dark" ? (
                  <FaSun className="text-yellow-400" />
                ) : (
                  <FaMoon className="text-gray-600" />
                )}
              </button>
            </div>
          </div>

          {/* Services */}
          <Service1 theme={theme} />
<Service2 theme={theme} />
<Service3 theme={theme} session={session} />



          {/* Help Button / Popup (Fixed to Bottom-Right) */}
          <div className="fixed bottom-5 right-5 z-50">
            {showPopup ? (
              <HelpChat onClose={() => setShowPopup(false)} />
            ) : (
              <HelpButton onClick={() => setShowPopup(true)} />
            )}
          </div>
        </div>
      </>
    );
  } else {
    return <LoginPage />;
  }
};

export default Patient_Login;
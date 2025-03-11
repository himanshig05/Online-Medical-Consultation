import React, { useContext } from "react";
import Link from "next/link";
import { ThemeContext } from "../../context/ThemeContext";
import { FaMoon, FaSun } from "react-icons/fa"; // Import icons for theme toggle

const Patient_Service1 = ({theme}) => {
  // const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div
      className={`w-full h-screen flex justify-between items-center transition-colors duration-300 ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      {/* Theme Toggle Button
      <button
        onClick={toggleTheme}
        className="absolute top-5 right-5 p-3 rounded-full bg-gray-300 dark:bg-gray-700 text-black dark:text-white hover:scale-110 transition"
      >
        {theme === "dark" ? <FaSun size={20} /> : <FaMoon size={20} />}
      </button> */}

      {/* Left Content */}
      <div className="flex flex-col">
      <div className="font-bold ml-20 text-6xl m-auto text-[#1a0135] dark:text-[#9b5de5]">
    Virtual
  </div>
  <div className="font-bold ml-20 text-6xl m-auto text-[#1a0135] dark:text-[#9b5de5]">
    Healthcare
  </div>
  <p className="ml-20 text-2xl m-auto italic text-[#222222] dark:text-[#7c7c7c]">
    Consult with top doctors across specialists
  </p>

        {/* Learn More Button */}
        <div className="m-6 ml-20 text-lg hover:scale-[1.01] duration-500">
          <Link
            href="/ListDoctors"
            className={`p-4 rounded-md ${
              theme === "dark"
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-red-500 hover:bg-red-600 text-white"
            }`}
          >
            Learn More
          </Link>
        </div>
      </div>

      {/* Right Image */}
      <div className="mr-8">
        <img
          src="img1.png"
          alt="Virtual Healthcare"
          className="w-[800px] h-[700px] object-contain"
        />
      </div>
    </div>
  );
};

export default Patient_Service1;

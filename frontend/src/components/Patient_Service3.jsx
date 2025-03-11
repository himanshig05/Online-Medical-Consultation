import React, { useContext } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { ThemeContext } from "../../context/ThemeContext";
const Patient_Service3 = ({theme, session}) => {
  // const { data: session } = useSession();
  // const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div
      className={`w-full h-screen flex justify-between items-center transition-colors duration-300 ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      {/* Left Section */}
      <div className="flex flex-col">
        <div className="font-bold ml-20 text-6xl m-auto text-[#1a0135] dark:text-[#9b5de5]">
          Edit Your
        </div>
        <div className="font-bold ml-20 text-6xl m-auto text-[#1a0135] dark:text-[#9b5de5]">
          Medical History
        </div>
        <p className="ml-20 text-2xl m-auto italic text-[#222222] dark:text-[#7c7c7c]">
          View and edit your medical profile and prescriptions
        </p>

        {/* Button */}
        <div className="m-6 ml-20 text-lg hover:scale-[1.01] duration-500">
          <Link
            href={`/patientProfile/${session?.user.email}`}
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

      {/* Right Section */}
      <div className="mr-8">
        <img
          src="pic2.png"
          alt="Medical Illustration"
          className="w-[800px] h-[600px] object-contain"
        />
      </div>
    </div>
  );
};

export default Patient_Service3;

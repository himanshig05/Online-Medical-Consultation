import React from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import Patient_Login from "@/pages/Patient_Login";
import { useRouter } from "next/router.js";

const LoginPage = () => {
   const router = useRouter();
  const { data: session } = useSession();

  if (session) {
    const emailId = session.user.email ;
    const index = emailId.indexOf("@");
    const check = emailId.slice(index);
    if (check == "@pec.edu.in") {
      router.push(`/findDoctor/${emailId}`);
      return null;
    }
    else {
      return (
      <div>
        <Patient_Login />
      </div>
    );
    }
    
  } else {
    return (
      <>
        <div className="flex h-screen w-full bg-gray-50">
          <div className="flex w-full h-screen items-center justify-center lg:w-1/2">
            <div className=" bg-white px-12 py-20 border-2 border-purple-500">
              <div className="flex justify-center items-center">
                <h1 className="text-6xl font-semibold text-slate-800 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-700">
                  MediCare
                </h1>
              </div>
              <div className="flex justify-center items-center">
                <p className="text-2xl font-semibold text-slate-800 bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-blue-700">
                  Modernizing Medication
                </p>
              </div>
              <div className="flex flex-col gap-4 items-center">
                <div className="m-10 mt-14 text-lg hover:scale-[1.05] duration-500">
                  <button
                    onClick={() => signIn()}
                    className="bg-purple-100 text-white py-4 px-20 rounded-md border-2 hover:border-indigo-700 border-transparent
                    bg-gradient-to-r from-blue-400 to-purple-700 font-bold"
                  >
                    Login as Patient
                  </button>
                </div>
                <div className="mx-10 text-lg hover:scale-[1.05] duration-500">
                  <button
                    onClick={() => signIn()}
                    className="bg-purple-100 text-white py-4 px-20 rounded-md border-2 hover:border-indigo-700 border-transparent bg-gradient-to-r from-blue-400 to-purple-700 font-bold"
                  >
                    Login as Doctor
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="hidden lg:flex w-1/2 relative items-center justify-center">
          <img src="bg1.gif" alt="" style={{width:"768px", height:"500px"}} />
          {/* <video width="800" height="1000" controls autoplay muted loop src="main.gif" type="video/mp4" ></video> */}
          </div>
        </div>
      </>
    );
  }

  
};

export default LoginPage;

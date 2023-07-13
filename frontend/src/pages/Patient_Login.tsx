import React from "react";
import { FaUserAlt } from "react-icons/fa";
import Service1 from '../components/Patient_Service1'
import Service2 from '../components/Patient_Service2'
import Service3 from '../components/Patient_Service3'
import { signOut, useSession } from "next-auth/react";
import Login from '../components/Login'


const Patient_Login = () => {
  const { data: session } = useSession();
  if (session) {
    return (
      <>
        <div className="bg-slate-50 w-full h-screen">
          <div className="w-full px-2 bg-white flex justify-between items-center">
            <div className="flex justify-between">
              {/* <div className="text-black lowercase"> */}
                {/* <img
                  src={session?.user?.image}
                  alt=""
                  style={{ width: "80px", height: "80px" }}
                />
              </div>
              <div className="text-black uppercase p-5 text-lg font-medium mt-2">
                <a href="">MY PROFILE: {session?.user?.email}</a>
              </div> */}
               <div className="text-4xl font-semibold text-slate-800 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-700 p-5">
                  MediCare
                </div>
            </div>
            <div className="flex justify-center">
              <ul className="flex justify-between space-x-8 text-black uppercase p-5 mr-12 font-sans">
                <li className="text-lg font-medium ml-10">
                  <a href="/">Home</a>
                </li>
                <li className="text-lg font-medium ml-10">
                  <a href="/ListDoctors">Find Doctors</a>
                </li>
                <li className="text-lg font-medium ml-10">
                  <a href="/Messenger">CHAT CONSULT</a>
                </li>
                <li className="text-lg font-medium ml-10">
                  <a href={`/patientProfile/${session?.user?.email}`}>Profile</a>
                </li>
                <li className="text-lg font-medium ml-10">
                  <button onClick={()=>signOut()}>SIGN OUT</button>
                </li>
              </ul>
            </div>
          </div>
          <Service1 />
          <Service2 />
          <Service3 />
        </div>
      </>
    );
  } else {
    return (
      <div>
        <Login />
      </div>
    )
  }
};

export default Patient_Login;

import React from 'react'
import ListOFDoctors from '../components/ListOfDoctors'
import { signOut, useSession } from "next-auth/react";

const Doctor_Profile = () => {
  const { data: session } = useSession();
  // const email = router.query.email;
  return (
    <>
    <div className='bg-[#F0EFFF] w-full h-screen'>
    <div className="w-full px-2 bg-white flex justify-between items-center">
            <div className="flex justify-between">
              {/* <div className="text-black">
                <img
                  src={'user3.png'}
                  alt=""
                  style={{ width: "80px", height: "80px" }}
                />
              </div> */}
              <div className="text-4xl font-semibold text-slate-800 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-700 p-5">
                  MediCare
                </div>
            </div>
            <div className="flex justify-center">
              <ul className="flex justify-between space-x-8 text-black uppercase p-5 mr-12">
                <li className="text-lg font-medium ml-10">
                  <a href="/">Home</a>
                </li>
                <li className="text-lg font-medium ml-10">
                  <a href="/ListDoctors">Find Doctors</a>
                </li>
                <li className="text-lg font-medium ml-10">
                  <a href="/Messenger">chat consult</a>
                </li>
                <li className="text-lg font-medium ml-10">
                  <a href={`/patientProfile/${session?.user?.email}`}>Profile</a>
                </li>
                <li className="text-lg font-medium ml-10">
                  <button onClick={() => signOut({ callbackUrl: "/" })}>SIGN OUT</button>
                </li>
              </ul>
            </div>
          </div>
          <div className='mt-12 flex justify-center items-center text-black text-3xl font-bold uppercase'>Doctors Across the World</div>
    <div className='bg-white mt-6'>
      <ListOFDoctors/>
    </div>
    </div>
    </>
  )
}

export default Doctor_Profile

import React from 'react'
import ListOFDoctors from '../components/ListOfDoctors'
const Doctor_Profile = () => {
  return (
    <>
    <div className='bg-[#F0EFFF] w-full h-screen'>
    <div className="w-full px-2 bg-[#8271E4] flex justify-between items-center">
            <div className="flex justify-between">
              <div className="text-white">
                <img
                  src={'user3.png'}
                  alt=""
                  style={{ width: "80px", height: "80px" }}
                />
              </div>
              <div className="text-white uppercase p-5 text-lg font-medium mt-2">
                <a href="/">MY PROFILE</a>
              </div>
            </div>
            <div className="flex justify-center">
              <ul className="flex justify-between space-x-8 text-white uppercase p-5 mr-12">
                <li className="text-lg font-medium ml-10">
                  <a href="/">Home</a>
                </li>
                <li className="text-lg font-medium ml-10">
                  <a href="#">About</a>
                </li>
                <li className="text-lg font-medium ml-10">
                  <a href="#">services</a>
                </li>
                <li className="text-lg font-medium ml-10">
                  <a href="#">Contact Us</a>
                </li>
                <li className="text-lg font-medium ml-10">
                  <button>Sign Out</button>
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

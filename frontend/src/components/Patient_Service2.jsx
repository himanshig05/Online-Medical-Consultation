import React from 'react'
import Link from "next/link";

const Patient_Service2 = () => {
  return (
    <>
      <div className="w-full h-screen bg-[#F0EFFF] flex justify-between items-center">
        {/* <div className="flex justify-center items-center"> */}
        {/* <div className='shadow-2xl ml-0 mr-0 mb-32 rounded-3xl hover:scale-[1.01] duration-500 p-10'> */}
        {/* <div className="flex justify-center items-center"> */}
        <div className="ml-20">
          <img
            src="pic2.png"
            alt=""
            style={{ width: "500px", height: "600px" }}
          />
        </div>
        <div className="flex flex-col">
          <div className="font-bold text-black ml-20 text-5xl m-auto mr-20">
            Instant online diagnosis system
          </div>
          <div className="m-6 ml-20 text-lg hover:scale-[1.01] duration-500">
            <Link
              href="/Messenger"
              className="bg-[#8271E4] text-white p-4 rounded-md"
            >
              Learn More{" "}
            </Link>
          </div>
        </div>
        {/* </div> */}
      </div>
      {/* </div> */}
    </>
  );
}

export default Patient_Service2
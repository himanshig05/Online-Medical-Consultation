import React from 'react'
import Link from 'next/link';

const Patient_Service1 = () => {

  return (
    <>
    <div className='w-full h-screen bg-white flex justify-between items-center'>
    {/* <div className="flex justify-center items-center"> */}
        {/* <div className='shadow-2xl ml-0 mr-0 mb-32 rounded-3xl hover:scale-[1.01] duration-500 p-10'> */}
          {/* <div className="flex justify-center items-center"> */}
            <div className="flex flex-col justify-center">
              <div className="font-bold text-[#2f0563] ml-20 text-6xl m-auto">
              Virtual
              </div>
              <div className="font-bold text-[#2f0563] ml-20 text-6xl m-auto">
              Healthcare
              </div>
              <p className='text-gray-500 ml-20 text-2xl m-auto italic'>Consult with top doctors across specialists</p>
              <div className="m-6 ml-20 text-lg hover:scale-[1.01] duration-500">
                <Link href="/ListDoctors" className="bg-red-500 text-white p-4 rounded-md">Learn More </Link>
              </div>
            </div>
            <div className='mr-8'>
              <img
                src="img1.png"
                alt=""
                style={{ width: "800px", height: "700px" }}
              />
            </div>
        {/* </div> */}
      </div>
      {/* </div> */}
    </>
  )
}

export default Patient_Service1
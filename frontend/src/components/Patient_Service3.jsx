import React from 'react'

const Patient_Service3 = () => {
  return (
    <>
    <div className='w-full h-screen bg-white flex justify-between items-center'>
            <div className="flex flex-col">
              <div className="font-bold text-[#2f0563] ml-20 text-6xl m-auto">
              Edit Your
              </div>
              <div className="font-bold text-[#2f0563] ml-20 text-6xl m-auto">
              Medical History
              </div>
              <div className="m-6 ml-20 text-lg hover:scale-[1.01] duration-500">
                <a href="#" target = '_blank' className="bg-red-500 text-white p-4 rounded-md">Learn More </a>
              </div>
            </div>
            <div className='mr-8 mt'>
              <img
                src="pic2.png"
                alt=""
                style={{ width: "800px", height: "600px"}}
              />
            </div>
      </div>
    </>
  )
}

export default Patient_Service3
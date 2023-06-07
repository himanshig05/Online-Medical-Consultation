import React from 'react'

const Patient_Service3 = () => {
  return (
    <>
    <div className='w-full h-screen bg-[#f6eff8] flex justify-between items-center'>
            <div className="flex flex-col">
              <div className="font-bold text-black ml-20 text-5xl m-auto">
              Edit your medical history
              </div>
              <div className="m-6 ml-20 text-lg hover:scale-[1.01] duration-500">
                <a href="#" target = '_blank' className="bg-[#8271E4] text-white p-4 rounded-md">Learn More </a>
              </div>
            </div>
            <div className='mr-20 mt'>
              <img
                src="pic3.png"
                alt=""
                style={{ width: "600px", height: "500px"}}
              />
            </div>
      </div>
    </>
  )
}

export default Patient_Service3
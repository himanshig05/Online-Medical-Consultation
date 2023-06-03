import React from 'react'

const Patient_Service1 = () => {
  return (
    <>
    <div className='w-full h-screen bg-[#EFF3FC] flex justify-between items-center'>
    {/* <div className="flex justify-center items-center"> */}
        {/* <div className='shadow-2xl ml-0 mr-0 mb-32 rounded-3xl hover:scale-[1.01] duration-500 p-10'> */}
          {/* <div className="flex justify-center items-center"> */}
            <div className="flex flex-col">
              <div className="font-bold text-black ml-20 text-5xl m-auto">
              Consult with top doctors across specialists
              </div>
              <div className="m-6 ml-20 text-lg hover:scale-[1.01] duration-500">
                <a href="#" target = '_blank' className="bg-[#8271E4] text-white p-4 rounded-md">Learn More </a>
              </div>
            </div>
            <div className='mr-20 mt'>
              <img
                src="pic1.png"
                alt=""
                style={{ width: "600px", height: "400px" }}
              />
            </div>
        {/* </div> */}
      </div>
      {/* </div> */}
    </>
  )
}

export default Patient_Service1
import React from "react";
// import videoBg from 'video.mp4'
const login = () => {
  return (
    <>
      <div className="flex h-screen w-full bg-gray-50">
        <div className="flex w-full h-screen items-center justify-center">
          <div className=" bg-white px-10 py-20 rounded-3xl border-2 border-grey-200">
            <div className="flex justify-center items-center">
              <h1 className="text-4xl font-semibold text-slate-800">
                MediConnect Online
              </h1>
            </div>
            <div className="flex flex-col gap-4">
            <div className="m-10 mt-14 text-lg hover:scale-[1.02] duration-500">
              <a href="" target="_blank" className="bg-sky-50 text-black py-4 px-20 rounded-md">Login as Patient</a>
            </div>
            <div className="mx-10 text-lg hover:scale-[1.02] duration-500">
              <a href="" target="_blank" className="bg-sky-50 text-black py-4 px-20 rounded-md">Login as Doctor</a>
            </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default login;

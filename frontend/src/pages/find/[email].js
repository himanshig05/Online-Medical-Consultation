import React, { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";

const DoctorTable = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [doctor, setDoctor] = useState({});
  const email = router.query.email;
  useEffect(() => {
    if (router.isReady) {
      fetch(`http://localhost:5000/search/${email}`, {
        method: "GET",
      })
        .then((res) => res.json())
        .then((data) => {
          setDoctor(data);
        });
    }
  }, [router.isReady]);
  if (doctor === null) {
    return (
      <button
        className="px-2 inline-flex text-xs leading-5
                       font-semibold rounded-full bg-green-100 text-green-800"
      >
        <Link href={`/create/${email}`}>Add Doctor</Link>
      </button>
    );
  } else {
      return (
        <>
          <div className="w-full px-2 bg-[#8271E4] flex justify-between items-center">
            <div className="flex justify-between">
              <div className="text-white">
                <img
                  src={session.user.image}
                  alt=""
                  style={{ width: "80px", height: "80px" }}
                />
              </div>
              <div className="text-white uppercase p-5 text-lg font-medium mt-2">
                <a href="">MY PROFILE: {session.user.email}</a>
              </div>
            </div>
            <div className="flex justify-center">
              <ul className="flex justify-between space-x-8 text-white uppercase p-5 mr-12">
                <li className="text-lg font-medium ml-10">
                  <a href="#">Home</a>
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
                  <button onClick={() => signOut({ callbackUrl: "/" })}>
                    Sign Out
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Name
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Specialist
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Status
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        ></th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr key={doctor.name}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {doctor.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {doctor.age}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {doctor.domain}
                          </div>
                          <div className="text-sm text-gray-500">
                            {doctor.qualifications}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className="px-2 inline-flex text-xs leading-5
                       font-semibold rounded-full bg-green-100 text-green-800"
                          >
                            {doctor.location}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            className="px-2 inline-flex text-xs leading-5
                       font-semibold rounded-full bg-green-100 text-green-800"
                          >
                            <Link href={`/edit/${doctor.email}`}>Edit</Link>
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </>
      );
  }
};

export default DoctorTable;

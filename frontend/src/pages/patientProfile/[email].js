import React, { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";
// import styles from '../../styles/profile.css'
const PatientProfile = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [patient, setPatient] = useState({});
  const email = router.query.email;
  useEffect(() => {
    if (router.isReady) {
      fetch(`http://localhost:5000/patientProfile/${email}`, {
        method: "GET",
      })
        .then((res) => res.json())
        .then((data) => {
          setPatient(data);
        });
    }
  }, [router.isReady]);
  if (patient === null) {
    return (
      <button
        className="px-2 inline-flex text-xs leading-5
                       font-semibold rounded-full bg-green-100 text-green-800"
      >
        <Link href={`/patientCreate/${email}`}>Add Profile</Link>
      </button>
    );
  } else {
    return (
      <>
        <div className="w-full px-2 bg-white flex justify-between items-center">
          <div className="flex justify-between">
            <div className="text-black uppercase p-5 text-lg font-medium mt-2">
              <a href="/">MY PROFILE</a>
            </div>
          </div>
          <div className="flex justify-center">
            <ul className="flex justify-between space-x-8 text-black uppercase p-5 mr-12">
              <li className="text-lg font-medium ml-10">
                <Link href="#">Home</Link>
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
        {/* <div className="flex flex-col">
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
          </div> */}
        <div className="bg-gray-100 h-screen w-full">
          <div className="bg-white rounded-b-3xl h-[86%] left-0 overflow-x-hidden pt-5 absolute top-[80px] w-[250px]">
            <div className="flex justify-center items-center flex-col">
              <div className="">
                <img
                  className=""
                  src={session?.user.image}
                  style={{ width: "200px", height: "200px" }}
                ></img>
                <div className="text-black text-xl font-bold pt-5 text-center">
                  {patient.name}
                </div>
              </div>
              <div className="text-center mt-4 space-y-4">
                <div className="text-white font-bold py-2 px-4 text-xl border-2 rounded-xl bg-blue-500 hover:bg-blue-700 text-center">
                  <Link href={`/patientUpdate/${session?.user.email}`}>
                    Edit Profile Pic
                  </Link>
                </div>
                <div className="text-white font-bold py-2 px-4 text-xl border-2 rounded-xl bg-blue-500 hover:bg-blue-700 text-center">
                  <Link href={`/patientUpdate/${session?.user.email}`}>
                    Edit Details
                  </Link>
                </div>
                <div className="text-white font-bold py-2 px-4 text-xl border-2 rounded-xl bg-blue-500 hover:bg-blue-700 text-center">
                  <Link href={`/patientPrescription/${session?.user.email}`}>
                    Add Prescription
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="ml-[29%] text-2xl px-10 w-[58%]">
            <h2 className="text-black pt-8 text-3xl font-sans mb-2.5 font-bold">
              IDENTITY
            </h2>
            <div className="bg-white rounded-3xl shadow-xl shadow-gray-500 pt-5 pb-5 pl-12 mb-5 mt-8">
              <div>
                <table className="border-none text-base h-[370px] w-[80%] text-black">
                  <tbody>
                    <tr>
                      <td>Name</td>
                      <td>:</td>
                      <td>{patient.name}</td>
                    </tr>
                    <tr>
                      <td>Age</td>
                      <td>:</td>
                      <td>{patient.age} years</td>
                    </tr>
                    <tr>
                      <td>Gender</td>
                      <td>:</td>
                      <td>{patient.gender}</td>
                    </tr>
                    <tr>
                      <td>Height</td>
                      <td>:</td>
                      <td>{patient.height}</td>
                    </tr>
                    <tr>
                      <td>Weight</td>
                      <td>:</td>
                      <td>{patient.weight}</td>
                    </tr>
                    <tr>
                      <td>Blood Group</td>
                      <td>:</td>
                      <td>{patient.bloodGroup}</td>
                    </tr>
                    <tr>
                      <td>Conditions</td>
                      <td>:</td>
                      <td>{patient.conditions}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            {patient.prescriptions?.map((p) => (
              <div className="bg-white rounded-3xl shadow-xl shadow-gray-500 pt-5 pb-5 pl-12 mb-5 mt-8">
                <div>
                  <table className="border-none text-base h-[370px] w-[80%] text-black">
                    <tbody>
                      <tr>
                        <td>Date</td>
                        <td>:</td>
                        <td>{p.date}</td>
                      </tr>
                      <tr>
                        <td>Medicine</td>
                        <td>:</td>
                        <td>{p.medicine}</td>
                      </tr>
                      <tr>
                        <td>Duration</td>
                        <td>:</td>
                        <td>{p.duration}</td>
                      </tr>
                      <tr>
                        <td>Amount</td>
                        <td>:</td>
                        <td>{p.amount}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    );
        }
};

export default PatientProfile;

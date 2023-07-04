
import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

 
export default function App() {

  const router = useRouter();
  const [doctors, setDoctors] = useState([]);
  const { data: session } = useSession();
  useEffect(() => {
    if (router.isReady) {
      getResponse().then((data) => {
        console.log(data);
        setDoctors(data.data);
      });
    }
  }, [router.isReady]);
  async function getResponse() {
    const response = await fetch("http://127.0.0.1:5000/search");
    console.log(response);
    if (!response.ok) {
      console.log(err);
    }
    const data = await response.json();
    return data;
  }

  const handleClick = async (doctor) => {
    try {
      const res = await fetch(`http://localhost:5000/conversations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          senderEmail: session.user.email,
          receiverEmail: doctor.email,
        }),
      })
        .then((res) => res.json)
        .then((data) => {
          router.push('/Messenger');
        });
    } catch (err) {
      console.log(err);
    }
  }

  return (
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
                  >
                    Experience
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {doctors.map((person) => (
                  <tr key={person.name}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded-full"
                            src={person.image}
                            alt=""
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {person.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {person.age}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {person.domain}
                      </div>
                      <div className="text-sm text-gray-500">
                        {person.qualifications}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className="px-2 inline-flex text-xs leading-5
                       font-semibold rounded-full bg-green-100 text-green-800"
                      >
                        {person.location}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {person.experience}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                        onClick={()=>handleClick(person)}
                        style={{ backgroundColor: "black", color: "white" }}
                      >
                        Contact
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
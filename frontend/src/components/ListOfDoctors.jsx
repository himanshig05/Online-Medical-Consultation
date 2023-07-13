import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function App() {
  const router = useRouter();
  const [doctors, setDoctors] = useState([]);
  const { data: session } = useSession();
  const [domain, setDomain] = useState("");
  const [searchDomain, setSearchDomain] = useState("");
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
          router.push("/Messenger");
        });
    } catch (err) {
      console.log(err);
    }
  };

  const handleSearch = () => {
    setSearchDomain(domain);
    console.log(searchDomain);
  };

  var viewDoctors = doctors;
  if (searchDomain !== "") {
    viewDoctors = viewDoctors.filter(function (d) {
      return d.domain === searchDomain;
    })
  }
  console.log(domain);

  return (
    <div className="flex flex-col">
      {/* <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label> */}
      <div className="relative pl-4">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none bg-white">
          <svg
            className="w-4 h-4 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              strokeWidth="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
        </div>
        <input
          type="search"
          id="default-search"
          className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white outline-none"
          placeholder="Search For Doctors By Domain..."
          required
          onChange={(e)=>setDomain(e.target.value)}
        ></input>
        {/* <div className='mr-12'> */}
        <button
          class="text-white absolute right-40 bottom-2.5 bg-black hover:scale-[1.03] focus:outline-none outline-none font-medium rounded-lg text-sm px-6 py-2"
          onClick={handleSearch}
        >
          Search
        </button>
        {/* </div> */}
      </div>

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
                    Domain
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Location
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
                {viewDoctors.map((person) => (
                  <tr key={person.name}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded-full"
                            src={person.picturePath}
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
                       font-semibold rounded-full bg-purple-300 text-purple-800"
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
                        onClick={() => handleClick(person)}
                        // style={{ backgroundColor: "black", color: "white" }}
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

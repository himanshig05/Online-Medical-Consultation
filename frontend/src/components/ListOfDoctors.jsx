import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { BASE_URL } from "../helper.js";

export default function App() {
  const router = useRouter();
  const [doctors, setDoctors] = useState([]);
  const { data: session } = useSession();
  const [domain, setDomain] = useState("");
  const [searchDomain, setSearchDomain] = useState("");

  useEffect(() => {
    if (router.isReady) {
      getResponse();
    }
  }, [router.isReady]);

  async function getResponse() {
    try {
      const response = await fetch(`${BASE_URL}/search`);
      if (!response.ok) {
        throw new Error("Failed to fetch doctors");
      }
      const data = await response.json();
      setDoctors(data.data);
    } catch (err) {
      console.error("Error fetching doctors:", err);
    }
  }

  const handleClick = async (doctor) => {
    try {
      await fetch(`${BASE_URL}/conversations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderEmail: session?.user?.email,
          receiverEmail: doctor.email,
        }),
      });
      router.push("/Messenger");
    } catch (err) {
      console.error("Error contacting doctor:", err);
    }
  };

  const handleSearch = () => {
    setSearchDomain(domain.trim());
  };

  const viewDoctors = searchDomain
    ? doctors.filter((d) => d.domain.toLowerCase() === searchDomain.toLowerCase())
    : doctors;

  return (
    <div className="flex flex-col">
      {/* Search Bar */}
      <div className="relative pl-4">
        <input
          type="search"
          className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white outline-none"
          placeholder="Search For Doctors By Domain..."
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
        />
        <button
          className="text-white absolute right-40 bottom-2.5 bg-black hover:scale-105 font-medium rounded-lg text-sm px-6 py-2"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>

      {/* Doctor Table */}
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {["Name", "Domain", "Location", "Experience", "Rating", "Actions"].map((header) => (
                    <th
                      key={header}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {viewDoctors.map((person) => (
                  <tr key={person.email}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img className="h-10 w-10 rounded-full" src={person.picturePath} alt="" />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{person.name}</div>
                          <div className="text-sm text-gray-500">{person.age}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{person.domain}</div>
                      <div className="text-sm text-gray-500">{person.qualifications}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-300 text-purple-800">
                        {person.location}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {person.experience} years
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ⭐ {person.rating}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2"
                        onClick={() => handleClick(person)}
                      >
                        Contact
                      </button>
                      <button
  className="text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5"
  onClick={() => router.push(`/view_profile?email=${person.email}`)}
>
  View Profile
</button>

                    </td>
                  </tr>
                ))}
                {viewDoctors.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-gray-500">
                      No doctors found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

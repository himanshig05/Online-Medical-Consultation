
import React, { useState, useEffect, useContext } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { BASE_URL } from "../helper.js";
import { ThemeContext } from "../../context/ThemeContext";
import { FaMoon, FaSun, FaMicrophone, FaTimes, FaSearch, FaClock } from "react-icons/fa";
import VoiceSearch from "./VoiceSearch";

export default function App() {
  const router = useRouter();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [doctors, setDoctors] = useState([]);
  const { data: session } = useSession();
  const [sortOrder, setSortOrder] = useState("desc");
  const [searchQuery, setSearchQuery] = useState("");
  const [stopVoiceSearch, setStopVoiceSearch] = useState(false);
  const [filteredSearches, setFilteredSearches] = useState([]); // Stores past searches from Redis
  const [showDropdown, setShowDropdown] = useState(false); // Controls the visibility of the dropdown

  useEffect(() => {
    if (router.isReady) {
      getResponse();
    }
  }, [router.isReady]);
  
  useEffect(() => {
    if (session?.user?.email) {
      fetchPastSearches();
    }
  }, [session, searchQuery]);

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

  const handleVoiceSearch = (transcript) => {
    setSearchQuery(transcript);
  };

  const handleClear = () => {
    setSearchQuery("");
    setStopVoiceSearch(true);
    setTimeout(() => {
      setStopVoiceSearch(false);
    }, 300); 
  };

  const handleSearch = async () => {
    if (session?.user?.email && searchQuery) {
      try {
        console.log(`Storing search term: ${searchQuery} for user: ${session.user.email}`);
        await fetch(`${BASE_URL}/search/storeSearch`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: session.user.email,
            searchTerm: searchQuery,
          }),
        });
        fetchPastSearches();
      } catch (err) {
        console.error("Error storing search term:", err);
      }
    }
  };

  const fetchPastSearches = async () => {
    if (session?.user?.email) {
      try {
        console.log(`Fetching past searches for user: ${session.user.email} with query: ${searchQuery}`);
        const response = await fetch(`${BASE_URL}/search/getPastSearches/${session.user.email}/${searchQuery}`);
        if (!response.ok) {
          throw new Error("Failed to fetch past searches");
        }
        const data = await response.json();
        setFilteredSearches(data);
      } catch (err) {
        console.error("Error fetching past searches:", err);
      }
    }
  };

  const viewDoctors = doctors
    .filter((d) =>
      !searchQuery ||
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.domain.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === "desc") {
        return b.averageRating - a.averageRating;
      } else {
        return a.averageRating - b.averageRating;
      }
    });

  return (
    <div className={`flex flex-col min-h-screen ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
      <div className="relative w-full flex items-center">
        <input
          type="search"
          className={`block w-full p-4 pl-12 text-sm border border-gray-300 rounded-lg outline-none ${
            theme === "dark" ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900"
          }`}
          placeholder="Search For Doctors By Name, Location, or Domain..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowDropdown(true);
          }}
        />
        <button
          className="absolute right-14 top-4"
          onClick={handleSearch}
        >
          <FaSearch size={18} className="text-gray-500 hover:text-gray-100 dark:text-gray-100 dark:hover:text-gray-100" />
        </button>
        <div className="absolute right-20.5 top--2">
          <VoiceSearch onSearch={handleVoiceSearch} onStop={stopVoiceSearch} />
        </div>
        <div className="absolute right-4 top-4 cursor-pointer" onClick={handleClear}>
          <FaTimes size={18} className="text-gray-500 hover:text-gray-100 dark:text-gray-100 dark:hover:text-gray-100" />
        </div>
        {showDropdown && filteredSearches.length > 0 && (
          <div className={`absolute top-12 left-0 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-10`}>
            {filteredSearches.map((search, index) => (
              <div
                key={index}
                className="p-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center"
                onClick={() => {
                  setSearchQuery(search);
                  setShowDropdown(false);
                }}
              >
                <FaClock className="mr-2 text-gray-500 dark:text-gray-300" />
                {search}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 dark:border-gray-700 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className={`${theme === "dark" ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-900"}`}>
                <tr>
                  {["Name", "Domain", "Location", "Experience", "Rating", "Actions"].map((header) => (
                    <th
                      key={header}
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    >
                      {header === "Rating" ? (
                        <div className="relative inline-block text-left">
                          <span className="text-sm">Rating</span>
                          <button
                            className="inline-block text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
                            id="rating-dropdown-button"
                            aria-expanded="false"
                            aria-haspopup="true"
                            onClick={(e) => {
                              e.preventDefault();
                              document.getElementById("rating-dropdown").classList.toggle("hidden");
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              className="inline-block w-5 h-5"
                            >
                              <path
                                fillRule="evenodd"
                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 111.414 1.414l-4 4a1 1 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                          <div
                            id="rating-dropdown"
                            className="origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none hidden"
                            role="menu"
                            aria-orientation="vertical"
                            aria-labelledby="rating-dropdown-button"
                          >
                            <button
                              className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
                              role="menuitem"
                              onClick={() => {
                                setSortOrder("desc");
                                document.getElementById("rating-dropdown").classList.add("hidden");
                              }}
                            >
                              Highest Rated
                            </button>
                            <button
                              className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
                              role="menuitem"
                              onClick={() => {
                                setSortOrder("asc");
                                document.getElementById("rating-dropdown").classList.add("hidden");
                              }}
                            >
                              Lowest Rated
                            </button>
                          </div>
                        </div>
                      ) : (
                        header
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className={`${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"} divide-y divide-gray-200 dark:divide-gray-700`}>
                {viewDoctors.map((person) => (
                  <tr key={person.email} className={`${theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-100"}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img className="h-10 w-10 rounded-full" src={person.picturePath} alt="" />
                        <div className="ml-4">
                          <div className="text-sm font-medium">{person.name}</div>
                          <div className="text-sm">{person.age}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">{person.domain}</div>
                      <div className="text-sm text-gray-500">{person.qualifications}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-300 dark:bg-purple-800 text-purple-800 dark:text-purple-300">
                        {person.location}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{person.experience} years</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">⭐ {person.averageRating}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2"
                        onClick={() => handleClick(person)}
                      >
                        Contact
                      </button>
                      <button
                        className={`font-medium rounded-lg text-sm px-5 py-2.5 transition focus:ring-4 focus:outline-none 
                          ${
                            theme === "dark"
                              ? "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500"
                              : "bg-green-400 text-gray-900 hover:bg-green-500 focus:ring-green-300"
                          }`}
                        onClick={() => router.push(`/view_profile?email=${person.email}`)}
                      >
                        View Profile
                      </button>
                    </td>
                  </tr>
                ))}
                {viewDoctors.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-gray-500 dark:text-gray-400">
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
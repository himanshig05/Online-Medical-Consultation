import React, { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";
import { BASE_URL } from "../../helper.js";
import { FaMoon, FaSun } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import Bell from "../Bell";


const DoctorTable = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [doctor, setDoctor] = useState({});
  const [darkMode, setDarkMode] = useState(false);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [hasReviewed, setHasReviewed] = useState(false);

  const email = router.query.email;

  useEffect(() => {
    if (router.isReady) {
      fetch(`${BASE_URL}/search/${email}`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch data");
          return res.json();
        })
        .then((data) => setDoctor(data))
        .catch((error) => setError(error.message));
    }
  }, [router.isReady]);

  useEffect(() => {
    const fetchDoctorReviews = async () => {
      try {
        const response = await fetch(`${BASE_URL}/rating/reviews/${email}`);
        if (!response.ok) throw new Error("Failed to fetch reviews");
        const data = await response.json();
        setReviews(data);

        if (session?.user?.email) {
          const userReview = data.find((rev) => rev.patientEmail === session.user.email);
          if (userReview) setHasReviewed(true);
        }
      } catch (error) {
        console.error("Error fetching doctor reviews:", error);
      }
    };

    if (email) fetchDoctorReviews();
  }, [email, session]);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        {error ? (
          <div className="flex flex-col w-full h-screen justify-center items-center">
            <h2 className="text-lg font-bold">Error: {error}</h2>
          </div>
        ) : doctor === null || Object.keys(doctor).length === 0 ? (
          <div className="flex flex-col w-full h-screen">
            <div className="flex justify-center">
              <img src="/doctor_team.png" style={{ width: "600px", height: "500px" }} />
            </div>
            <div className="text-[#2f0563] dark:text-[#e4d7f5] font-bold justify-center flex text-5xl mt-6">
              Join us in bringing healthcare to all, register now!
            </div>
            <div className="flex justify-center mt-8 text-lg hover:scale-[1.01] duration-500">
              <Link href={`/doctorCreate/${email}`} className="bg-red-500 text-white p-4 rounded-md">
                Register Now{" "}
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="w-full px-2 flex justify-between items-center">
              <div className="text-4xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-700 p-5">
                MediCare
              </div>
              <div className="flex justify-center">
                <ul className="flex justify-between space-x-8 uppercase p-5 mr-12">
                  <li className="text-lg font-medium ml-10">
                    <Link href="/">Home</Link>
                  </li>
                  <li className="text-lg font-medium ml-10">
                    <Link href="/Messenger">PATIENTS</Link>
                  </li>
                  <li className="text-lg font-medium ml-10">
                    <Link href="/DoctorRequests">VERIFY REQUESTS</Link>
                  </li>
                  <li>
                   <Bell doctorEmail={email} /> 
                   </li>
                  <li className="text-lg font-medium ml-10">
                    <button onClick={() => signOut({ callbackUrl: "/" })}>SIGN OUT</button>
                  </li>
                  <button onClick={toggleDarkMode} className="flex items-center space-x-2 text-lg font-medium text-blue-700 hover:text-blue-500">
                    {darkMode ? <FaSun className="text-yellow-400" size={20} /> : <FaMoon className="text-blue-500" size={20} />}
                  </button>
                </ul>
              </div>
            </div>

            {/* Sidebar */}
            <div className="bg-white dark:bg-gray-800 rounded-b-3xl h-[86%] left-0 overflow-x-hidden pt-5 absolute top-[80px] w-[250px]">
              <div className="flex justify-center items-center flex-col">
                {doctor.picturePath && <img src={doctor.picturePath} style={{ width: "200px", height: "200px" }} />}
                <div className="text-black dark:text-gray-100 text-xl font-bold pt-5 text-center">{doctor.name}</div>
                <div className="text-center mt-4 space-y-4">
                  <div className="text-white font-bold py-2 px-4 text-xl border-2 rounded-xl bg-blue-500 hover:bg-blue-700 text-center">
                    <Link href={`/editDoctor/${session?.user.email}`}>Edit Details</Link>
                  </div>
                  <div className="text-white font-bold py-2 px-4 text-xl border-2 rounded-xl bg-blue-500 hover:bg-blue-700 text-center">
                    <Link href="/Messenger">Your Patients</Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Doctor Info & Reviews */}
            <div className="ml-[29%] text-2xl px-10 w-[58%]">
              <h2 className="text-black dark:text-gray-100 pt-8 text-3xl font-sans mb-2.5 font-bold">IDENTITY</h2>
              <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl shadow-gray-500 pt-5 pb-5 pl-12 mb-5 mt-8">
              <table className="border-none text-base h-[370px] w-[80%]">
                      <tbody>
                        <tr>
                          <td className="text-black dark:text-gray-100">
                            Name
                          </td>
                          <td>:</td>
                          <td className="text-black dark:text-gray-100">
                            {doctor.name}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-black dark:text-gray-100">Age</td>
                          <td>:</td>
                          <td className="text-black dark:text-gray-100">
                            {doctor.age} years
                          </td>
                        </tr>
                        <tr>
                          <td className="text-black dark:text-gray-100">
                            Email
                          </td>
                          <td>:</td>
                          <td className="text-black dark:text-gray-100">
                            {doctor.email}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-black dark:text-gray-100">
                            Address
                          </td>
                          <td>:</td>
                          <td className="text-black dark:text-gray-100">
                            {doctor.location}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-black dark:text-gray-100">
                            Speciality
                          </td>
                          <td>:</td>
                          <td className="text-black dark:text-gray-100">
                            {doctor.domain}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-black dark:text-gray-100">
                            Qualifications
                          </td>
                          <td>:</td>
                          <td className="text-black dark:text-gray-100">
                            {doctor.qualifications}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-black dark:text-gray-100">
                            Experience
                          </td>
                          <td>:</td>
                          <td className="text-black dark:text-gray-100">
                            {doctor.experience} years
                          </td>
                        </tr>
                        <tr className="align-middle">
                          <td className="text-black dark:text-gray-100 align-middle">Average Rating</td>
                          <td className="align-middle">:</td>
                          <td className="text-black dark:text-gray-100 align-middle">
                            <div className="flex items-center space-x-2">
                              <div className="flex items-center space-x-1">
                                {[...Array(5)].map((_, index) => (
                                  <FaStar
                                    key={index}
                                    size={18}
                                    className={`align-middle ${index < (doctor.averageRating || 0) ? "text-yellow-400" : "text-gray-400"}`}
                                  />
                                ))}
                              </div>
                              <span className="text-lg align-middle">({doctor.averageRating || "No ratings yet"})</span>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
              </div>

              {/* Reviews Section */}
              <section className="mt-8 p-6 rounded-lg shadow-lg bg-white dark:bg-gray-800 text-black dark:text-white">
                <h2 className="text-3xl font-semibold mb-4">Reviews</h2>
                {reviews.length > 0 ? (
                  <table className="w-full border-collapse border border-gray-300 dark:border-gray-700 text-lg">
                    <tbody>
                      {reviews.map((review, index) => (
                        <tr key={index} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-black dark:text-gray-100">
                            {`⭐`.repeat(review.rating)}
                          </td>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-black dark:text-gray-100">
                            {review.feedback}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-gray-500 text-lg">No reviews yet.</p>
                )}
              </section>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DoctorTable;

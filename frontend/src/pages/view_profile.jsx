import React, { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { BASE_URL } from "../helper.js";  // Make sure this is the correct base URL
import { FaStar } from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext"; 
import Link from 'next/link';


const DoctorTable = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [doctor, setDoctor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [requestStatus, setRequestStatus] = useState("");  // Track the status of the request
  const { theme, toggleTheme } = useTheme();

  const email = router.query.email;

  // Fetch Doctor details
  useEffect(() => {
    if (router.isReady) {
      fetch(`${BASE_URL}/search/${email}`)
        .then((res) => res.json())
        .then((data) => setDoctor(data));
    }
  }, [router.isReady, email]);

  // Fetch Doctor Reviews
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

    if (email) {
      fetchDoctorReviews();
    }
  }, [email, session]);

  // Fetch Request Status
  useEffect(() => {
    const fetchRequestStatus = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/requests/getRequestStatus`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            doctorEmail: email,
            patientEmail: session?.user?.email,
          }),
        });
        const data = await response.json();
        if (response.ok) {
          setRequestStatus(data.status);
        } else {
          setRequestStatus("pending");  // Default if request does not exist
        }
      } catch (error) {
        console.error("Error fetching request status:", error);
        setRequestStatus("pending");
      }
    };

    if (session?.user?.email && email) {
      fetchRequestStatus();
    }
  }, [email, session]);

  const handleReviewSubmit = async () => {
    if (!rating || !review.trim()) return alert("Please provide a rating and review!");

    const newReview = {
      patientEmail: session?.user?.email || "Anonymous",
      rating,
      feedback: review,
    };

    try {
      const response = await fetch(`${BASE_URL}/rating/rating`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctorEmail: email,
          patientEmail: session?.user?.email,
          rating,
          feedback: review,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to submit review");

      setReviews((prev) => [...prev, newReview]);
      setRating(0);
      setReview("");
      setSubmitted(true);
      setHasReviewed(true);
    } catch (error) {
      console.error("Error submitting review:", error.message);
      alert("Failed to submit review. Check console for details.");
    }
  };

  const handleSendRequest = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/requests/sendRequest`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctorEmail: email,
          patientEmail: session?.user?.email,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to send request");

      setRequestStatus("pending");
      alert("Request sent successfully!");
    } catch (error) {
      console.error("Error sending request:", error);
      alert("Failed to send request.");
    }
  };

  if (!doctor) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <img src="/doctor_team.png" className="w-[600px] h-[500px]" />
        <h1 className="text-5xl font-bold text-[#2f0563] mt-6 text-center">
          Join us in bringing healthcare to all, register now!
        </h1>
        <Link
          href={`/doctorCreate/${email}`}
          className="mt-8 bg-red-500 text-white px-6 py-3 rounded-lg text-lg font-medium hover:scale-105 transition"
        >
          Register Now
        </Link>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
      <header className={`w-full px-2 flex justify-between items-center ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"} shadow-md py-4`}>
        <div className="text-4xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-700 p-5">MediCare</div>
      </header>

      <main className="max-w-5xl mx-auto py-10">
        {/* Doctor Profile */}
        <section className={`p-6 rounded-lg shadow-lg ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
          <h2 className="text-3xl font-semibold mb-4">Doctor Profile</h2>
          <table className="w-full border-collapse">
            <tbody className="text-lg">
              {Object.entries({
                Name: doctor.name,
                Age: `${doctor.age} years`,
                Email: doctor.email,
                Address: doctor.location,
                Speciality: doctor.domain,
                Qualifications: doctor.qualifications,
                Experience: `${doctor.experience} years`,
              }).map(([key, value]) => (
                <tr key={key} className="border-b border-gray-300">
                  <td className="py-2 font-medium">{key}</td>
                  <td className="py-2">: {value}</td>
                </tr>
              ))}
              <tr>
                <td className="py-2 font-medium">Average Rating</td>
                <td className="py-2 flex items-center">
                  {[...Array(5)].map((_, index) => (
                    <FaStar key={index} color={index < (doctor.averageRating || 0) ? "#FFD700" : "#ccc"} />
                  ))}
                  ({doctor.averageRating || "No ratings yet"})
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Review Submission */}
        {requestStatus === "accepted" ? (
          <div>
          {hasReviewed ? (
            <div className={`p-4 rounded-md mt-8 text-center ${theme === "dark" ? "bg-green-700" : "bg-green-100"}`}>
              ✅ You have already reviewed the doctor!
            </div>
          ) : (
            <section className={`mt-8 p-6 rounded-lg shadow-lg ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
              <h2 className="text-3xl font-semibold mb-4">Rate and Review</h2>
              <div className="flex space-x-2">
                {[...Array(5)].map((_, index) => (
                  <FaStar
                    key={index}
                    color={index < rating ? "#FFD700" : "#ccc"}
                    onClick={() => setRating(index + 1)}
                    className="cursor-pointer text-2xl"
                  />
                ))}
              </div>
              <textarea
                className={`w-full mt-3 p-2 border rounded ${theme === "dark" ? "bg-gray-700 text-white" : "bg-white text-black"}`}
                placeholder="Write your review..."
                value={review}
                onChange={(e) => setReview(e.target.value)}
              />
              <button
                className="mt-3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleReviewSubmit}
                disabled={submitted}
              >
                {submitted ? "Submitted" : "Submit Review"}
              </button>
            </section>
          )}
        </div>
        ) : requestStatus === "pending" || requestStatus==="rejected"? (
          <section className="mt-8 p-6 rounded-lg shadow-lg bg-gray-500 text-white">
            <h2 className="text-3xl font-semibold mb-4">Review Request Pending</h2>
            <p>Your review request is pending approval from the doctor.</p>
            <button onClick={handleSendRequest} className="mt-4 bg-blue-500 text-white px-6 py-3 rounded-lg">
        Request Again
      </button>
          </section>
        ) : (
          <button
            className="mt-8 bg-blue-500 text-white font-bold py-2 px-4 rounded"
            onClick={handleSendRequest}
          >
            Request to Submit Review
          </button>
        )}

        {/* Doctor Reviews */}
        <section className={`mt-8 p-6 rounded-lg shadow-lg ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
          <h2 className="text-3xl font-semibold mb-4">Reviews</h2>
          {reviews.length > 0 ? (
            <table className="w-full border-collapse border border-gray-300">
              <tbody>
                {reviews.map((review, index) => (
                  <tr key={index} className={`${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}>
                    <td className="border border-gray-300 px-4 py-2">{`⭐`.repeat(review.rating)}</td>
                    <td className="border border-gray-300 px-4 py-2">{review.feedback}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No reviews yet.</p>
          )}
        </section>
      </main>
    </div>
  );
};

export default DoctorTable;

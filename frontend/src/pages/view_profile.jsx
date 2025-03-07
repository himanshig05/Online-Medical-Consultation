import React, { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";
import { BASE_URL } from "../helper.js";
import { FaStar } from "react-icons/fa";

const DoctorTable = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [doctor, setDoctor] = useState(null);
  const [reviews, setReviews] = useState([]); // Fixed missing state
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const email = router.query.email;

  useEffect(() => {
    if (router.isReady) {
      fetch(`${BASE_URL}/search/${email}`)
        .then((res) => res.json())
        .then((data) => {
          setDoctor(data);
        });
    }
  }, [router.isReady]);

  useEffect(() => {
    const fetchDoctorReviews = async () => {
      try {
        const response = await fetch(`${BASE_URL}/rating/reviews/${email}`);
        if (!response.ok) throw new Error("Failed to fetch reviews");

        const data = await response.json();
        console.log("Doctor Reviews:", data);
        setReviews(data);
      } catch (error) {
        console.error("Error fetching doctor reviews:", error);
      }
    };

    if (email) {
      fetchDoctorReviews();
    }
  }, [email]);

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
      console.log("Server Response:", data);

      if (!response.ok) throw new Error(data.message || "Failed to submit review");

      setReviews((prev) => [...prev, newReview]); // Update reviews locally
      setRating(0);
      setReview("");
      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting review:", error.message);
      alert("Failed to submit review. Check console for details.");
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
          href={`/create/${email}`}
          className="mt-8 bg-red-500 text-white px-6 py-3 rounded-lg text-lg font-medium hover:scale-105 transition"
        >
          Register Now
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 text-black">
      <header className="flex justify-between items-center px-5 py-3 bg-white shadow-md">
        <h1 className="text-4xl font-bold text-gradient bg-gradient-to-r from-blue-400 to-purple-700">
          MediCare
        </h1>
        <nav className="flex space-x-8 text-lg">
          <Link href="/" className="hover:text-blue-500">Home</Link>
          <Link href="/Messenger" className="hover:text-blue-500">Patients</Link>
          <button onClick={() => signOut({ callbackUrl: "/" })} className="text-red-500 hover:underline">Sign Out</button>
        </nav>
      </header>

      <main className="max-w-5xl mx-auto py-10">
        {/* Doctor Profile */}
        <section className="bg-white p-6 rounded-lg shadow-lg">
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
        <section className="mt-8 bg-white p-6 rounded-lg shadow-lg">
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
            className="w-full mt-3 p-2 border rounded"
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

        {/* Reviews Table */}
        <section className="mt-8 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-3xl font-semibold mb-4">Reviews</h2>
          {reviews.length > 0 ? (
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  {/* <th className="border border-gray-300 px-4 py-2 text-left">Patient Email</th> */}
                  <th className="border border-gray-300 px-4 py-2 text-left">Rating</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Feedback</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((review, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    {/* <td className="border border-gray-300 px-4 py-2">{review.patientEmail}</td> */}
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

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
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const email = router.query.email;

  useEffect(() => {
    if (router.isReady) {
      fetch(`${BASE_URL}/search/${email}`, { method: "GET" })
        .then((res) => res.json())
        .then((data) => {
          setDoctor(data);
        });
    }
  }, [router.isReady]);

  const handleReviewSubmit = async () => {
    if (!rating || !review.trim()) return alert("Please provide a rating and review!");

    const newReview = {
      user: { name: session?.user?.name || "Anonymous" },
      rating,
      comment: review,
    };

    const updatedReviews = [...(doctor.reviews || []), newReview];
    const newAverageRating = (
      updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length
    ).toFixed(1);

    setDoctor((prev) => ({
      ...prev,
      reviews: updatedReviews,
      averageRating: newAverageRating,
    }));

    await fetch(`${BASE_URL}/rating`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        doctorEmail: email,
        patientEmail: session?.user?.email,
        rating,
        feedback: review,
      }),
    });

    setSubmitted(true);
    setRating(0);
    setReview("");
  };

  if (!doctor) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <img src="/doctor_team.png" className="w-[600px] h-[500px]" />
        <h1 className="text-5xl font-bold text-[#2f0563] mt-6 text-center">
          Join us in bringing healthcare to all, register now!
        </h1>
        <Link href={`/create/${email}`} className="mt-8 bg-red-500 text-white px-6 py-3 rounded-lg text-lg font-medium hover:scale-105 transition">
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
                    <FaStar key={index} color={index < doctor.averageRating ? "#FFD700" : "#ccc"} />
                  ))}
                  ({doctor.averageRating})
                </td>
              </tr>
            </tbody>
          </table>
        </section>

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

        <section className="mt-8 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-3xl font-semibold mb-4">Reviews</h2>
          {doctor.reviews && doctor.reviews.length > 0 ? (
            <ul className="space-y-4">
              {doctor.reviews.map((review, index) => (
                <li key={index} className="p-4 border rounded-md shadow">
                  <p className="text-lg font-medium">{review.comment}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No reviews yet.</p>
          )}
        </section>
      </main>
    </div>
  );
};

export default DoctorTable;
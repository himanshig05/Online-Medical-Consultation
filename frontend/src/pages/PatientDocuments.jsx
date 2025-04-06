import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { BASE_URL } from "../helper.js"; 

const PatientDocuments = () => {
  const { data: session } = useSession();
  const patientEmail = session?.user?.email;
  const [documents, setDocuments] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (!patientEmail) return;

    const fetchDocuments = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/media/documents/patient/${encodeURIComponent(patientEmail)}`
        );

        if (!response.ok) {
          throw new Error(`HTTP Error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched Data:", data);
        setDocuments(data);
      } catch (error) {
        console.error("Error fetching documents:", error);
      }
    };

    fetchDocuments();
  }, [patientEmail]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-8">
      <button 
        onClick={() => router.push(`/patientProfile/${session?.user?.email}`)} 
        className="absolute top-4 left-4 text-blue-600 font-semibold hover:underline"
      >
        ← Back to Patient Profile
      </button>

      <h1 className="text-4xl font-bold text-blue-700 mb-8">📄 Patient Documents</h1>
      <div className="w-full max-w-4xl overflow-x-auto">
        <table className="w-full bg-white shadow-lg rounded-lg border border-blue-300 overflow-hidden">
          <thead>
            <tr className="bg-blue-600 text-white text-lg">
              <th className="p-4 text-left">Doctor Email</th>
              <th className="p-4 text-left">Title</th>
              <th className="p-4 text-left">Download</th>
              <th className="p-4 text-left">Uploaded Time</th>
            </tr>
          </thead>
          <tbody>
            {documents.length > 0 ? (
              documents.map((doc, index) => (
                <tr
                  key={index}
                  className="border-b border-blue-300 hover:bg-blue-50 transition duration-200"
                >
                  <td className="p-4 text-gray-800">{doc.doctorEmail || "N/A"}</td>
                  <td className="p-4 text-gray-800 font-medium">{doc.title || "Untitled"}</td>
                  <td className="p-4">
                    {doc.document ? (
                      <a
                        href={doc.document}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Download 📥
                      </a>
                    ) : (
                      <span className="text-gray-500">No file</span>
                    )}
                  </td>
                  <td className="p-4 text-gray-600">
                    {doc.createdAt ? new Date(doc.createdAt).toLocaleString() : "Unknown"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-5 text-center text-gray-500 text-lg">
                  No documents found 📂
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PatientDocuments;

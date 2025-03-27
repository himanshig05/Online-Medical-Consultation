import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { BASE_URL } from "../../helper.js"; 

const UploadForm = () => {
  // const { patientEmail } = useParams(); // Extract patientEmail from URL
const router =useRouter();
  const patientEmail = router.query.email;
  const { data: session } = useSession();
  const doctorEmail =session?.user?.email;
  console.log("patientEmail : ", patientEmail);
  console.log("doctorEmail : ", doctorEmail);
  const [title, setTitle] = useState("");
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setDocument(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!title || !document) {
      setMessage("❌ Please provide a title and upload a document.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", document);
    formData.append("upload_preset", "MediCare");

    const isImage = document.type.startsWith("image/");
    const resourceType = isImage ? "image" : "raw";

    try {
      // Upload file to Cloudinary
      const cloudinaryResponse = await fetch(
        `https://api.cloudinary.com/v1_1/ddenfqz4u/${resourceType}/upload`,
        { method: "POST", body: formData }
      );

      const cloudinaryData = await cloudinaryResponse.json();

      if (!cloudinaryResponse.ok || !cloudinaryData.secure_url) {
        throw new Error(cloudinaryData.error?.message || "Cloudinary upload failed.");
      }

      console.log("Cloudinary Upload Success:", cloudinaryData.secure_url);
      const backendResponse = await fetch(
        `${BASE_URL}/media/upload/${patientEmail}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            document: cloudinaryData.secure_url,
            doctorEmail,
            patientEmail, 
          }),
        }
      );

      const backendData = await backendResponse.json();

      if (backendResponse.ok) {
        setMessage("✅ Document uploaded successfully!");
      } else {
        throw new Error(backendData.error || "Backend upload failed.");
      }
    } catch (error) {
      setMessage(`❌ Upload failed: ${error.message}`);
      console.error("Upload Error:", error);
    }

    setLoading(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-screen h-screen flex items-center justify-center bg-white"
    >
       <button 
  onClick={() => router.push(`/patientProfile/${patientEmail}`)} 
  className="absolute top-4 left-4  text-blue-700 font-semibold mb-4"
>
  ← Back to Patient Profile
</button>
      <div className="w-full max-w-2xl p-8 bg-white shadow-xl rounded-2xl border border-gray-200">
        <h2 className="text-3xl font-bold text-blue-700 text-center mb-6">Upload Document</h2>
        <p className="text-gray-600 text-center mb-4">Patient Email: <span className="font-semibold text-gray-800">{patientEmail}</span></p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-800 font-medium mb-2">Title</label>
            <input
              type="text"
              className="w-full px-4 py-3 bg-gray-50 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Enter document title"
            />
          </div>

          <div>
            <label className="block text-gray-800 font-medium mb-2">Upload File</label>
            <input 
              type="file" 
              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
              className="w-full px-4 py-3 bg-gray-50 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              onChange={handleFileChange} 
              required 
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-blue-700 text-white px-6 py-3 rounded-lg shadow-lg font-semibold tracking-wide focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-blue-800 transition"
            disabled={loading}
          >
            {loading ? "Uploading..." : "Upload"}
          </motion.button>
        </form>
        {message && <p className="mt-4 text-center text-blue-700 text-lg font-semibold">{message}</p>}
      </div>
    </motion.div>
  );
};

export default UploadForm;


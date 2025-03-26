const Media = require("../models/mediaModel");

const uploadDocument = async (req, res) => {
  try {
    const { title, document, doctorEmail } = req.body;
    const { patientEmail } = req.params;

    if (!title || !document || !doctorEmail || !patientEmail) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const newMedia = new Media({
      title,
      document, 
      doctorEmail,
      patientEmail,
    });

    await newMedia.save();

    res.status(201).json({
      message: "✅ Document saved successfully!",
      document,
    });
  } catch (error) {
    console.error("Error saving document:", error);
    res.status(500).json({
      error: "Error saving document",
      details: error.message,
    });
  }
};


const getPatientDocuments = async (req, res) => {
    try {
        console.log("🔹 Request received:", req.params); // Debug log
        const { patientEmail } = req.params;

        if (!patientEmail) {
            return res.status(400).json({ error: "Patient email is required!" });
        }

        const documents = await Media.find({ patientEmail });
        
        if (!documents.length) {
            return res.status(404).json({ message: "No documents found for this patient." });
        }

        res.json(documents);
    } catch (error) {
        console.error("Error fetching documents:", error);
        res.status(500).json({ error: "Server error" });
    }
};

module.exports={uploadDocument,getPatientDocuments };
const express = require("express");
const router = express.Router();
const { uploadDocument, getPatientDocuments } = require("../controllers/mediaController");

router.post("/upload/:patientEmail", uploadDocument);
router.get("/documents/patient/:patientEmail", getPatientDocuments);




module.exports = router;

const express=require("express");
const patientController=require("../controllers/patient.js");

const router=express.Router();

router.get("/patientProfile/:email",patientController.getPatient);
router.post("/patientCreate/:email",patientController.createPatient);
router.post("/patientUpdate/:email",patientController.updatePatient);

module.exports=router;
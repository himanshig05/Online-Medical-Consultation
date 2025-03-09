const express=require("express");
const patientController=require("../controllers/patient.js");

const router=express.Router();

router.patch("/addPrescription/:email",patientController.addPrescription);
router.patch("/deletePrescription",patientController.deletePrescription);
router.patch("/editPrescription",patientController.editPrescription);

module.exports=router;
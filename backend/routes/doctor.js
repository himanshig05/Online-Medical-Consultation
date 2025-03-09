const express=require("express");
const doctorController=require("../controllers/doctor.js");

const router=express.Router();

router.get("/search",doctorController.getDoctor);
router.get("/search/:email",doctorController.getDoctorEmail);
router.post("/create",doctorController.createDoctor);
router.post("/create/:email",doctorController.createDoctorEmail);
router.post("/update/:email",doctorController.updateDoctor);

module.exports=router;

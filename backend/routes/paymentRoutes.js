const express=require("express");
const { initiatePayment, updateFeeStatus, getPatientPaymentHistory, getDoctorPaymentHistory} = require("../controllers/payment.js");

const router=express.Router();

router.post('/paynow/:patientEmail', initiatePayment);
router.post('/updateStatus', updateFeeStatus);
router.get('/view-patient/:patientEmail', getPatientPaymentHistory);
router.get('/view-doctor/:doctorEmail', getDoctorPaymentHistory);

module.exports=router;










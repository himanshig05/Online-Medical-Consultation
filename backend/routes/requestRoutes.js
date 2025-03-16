const express = require("express");
const { sendRequest, getRequestStatus } = require("../controllers/patient");
const { getAllRequests, updateRequest ,countPendingRequests} = require("../controllers/doctor");

const router = express.Router();
router.post("/SendRequest", sendRequest);
router.post("/getRequestStatus", getRequestStatus);

router.get("/getAllRequests/:doctorEmail", getAllRequests);
router.put("/UpdateRequest", updateRequest);
router.get("/pending/count/:doctorEmail", countPendingRequests);


module.exports = router;

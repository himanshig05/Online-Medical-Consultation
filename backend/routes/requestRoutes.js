const express = require("express");
const { sendRequest, getRequestStatus } = require("../controllers/patient");
const { getAllRequests, updateRequest } = require("../controllers/doctor");

const router = express.Router();
router.post("/SendRequest", sendRequest);
router.post("/getRequestStatus", getRequestStatus);

router.get("/getAllRequests/:doctorEmail", getAllRequests);
router.put("/UpdateRequest", updateRequest);


module.exports = router;

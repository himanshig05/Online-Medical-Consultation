const Patient = require("../models/patientModel");
const RequestModel = require("../models/requestModel"); 
const Notification = require("../models/notificationModel"); // ✅ Import the model


const mongoose=require("mongoose");
const createPatient= async function (req, res) {
  const patient = new Patient({
    email: req.params.email,
    name: req.body.name,
    age: req.body.age,
    gender: req.body.gender,
    height: req.body.height,
    weight: req.body.weight,
    bloodGroup: req.body.bloodGroup,
    conditions: req.body.conditions,
    picturePath: req.body.picturePath,
    prescriptions: [],
  });
  await patient.save();
  res.json(patient);
};

// get patient profile
const getPatient= async function (req, res) {
  const email = req.params.email;
  const patient = await Patient.findOne({ email: email });
  res.json(patient);
};


// update patient profile
const updatePatient= async function (req, res) {
  try{
  console.log(req.params.email);
  const emailid=req.params.email;
  const patient = await Patient.findOne(
    {
      email: emailid,
    });
    console.log(patient);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    const updated=
    {
        name: req.body.name??patient.name,
        age: req.body.age??patient.age,
        gender: req.body.gender??patient.gender,
        height: req.body.height??patient.height,
        weight: req.body.weight??patient.weight,
        bloodGroup: req.body.bloodGroup??patient.bloodGroup,
        conditions: req.body.conditions??patient.conditions,
        picturePath:req.body.picturePath??patient.picturePath,
      };
    const patient1=await Patient.findOneAndUpdate({ email: req.params.email },
      { $set: updated },
      { new: true });
  console.log(patient1); 
  res.json(patient1);}
  catch(error){
    console.log("error");
    res.send(500).json({"error":error});
  }
};

// add prescription
const addPrescription= async function (req, res) {

  try {
    const email = req.params.email;
    const { date, medicine, duration, amount, current } = req.body;

    const newPrescription = {
      date,
      medicine,
      duration,
      amount,
      doctor: current,
      status: "active"
    }

    const updatedPatient = await Patient.findOneAndUpdate(
      { email: email },
      { $push: { prescriptions: newPrescription } },  
      { new: true }
    ); 
    
    console.log(updatedPatient.prescriptions);
    res.json(updatedPatient);
  } catch (error) {
    console.log("here is an error lmao ", error);
    res.send("there has been an error");
  }
};

// delete prescription
const deletePrescription= async function (req, res) {
  const email = req.body.email;
  const prescription_id_objectId = new mongoose.Types.ObjectId(req.body.prescriptionId);
  const curr_user = req.body.curr_user;

  if (email == curr_user) {
    const deletedPrescription = await Patient.updateOne({
      email: email,
    }, {
      $pull: { prescriptions: {_id: prescription_id_objectId}}
    })
    return res.json({deleted: true});  
  }

  const deletedPrescription = await Patient.updateOne({
    email: email,
  }, {
    $pull: { prescriptions: {_id: prescription_id_objectId, doctor: curr_user}}
  })
  console.log(deletedPrescription);
  if (deletedPrescription.modifiedCount == 0) {
    return res.json({deleted: false});
  }
  res.json({deleted: true});  
  };
  
//edit prescription
const editPrescription= async function (req, res) {
  const email = req.body.email;
  const prescription_id = new mongoose.Types.ObjectId(req.body.prescriptionId);
  //since the edit button is available to only that person who has created the prescription, we don't need to check here
  // console.log(req.body);
  
    const curr_patient = await Patient.findOne({email: email});
    for (let i = 0; i < curr_patient.prescriptions.length; i++) {
      if (curr_patient.prescriptions[i]._id.equals(prescription_id)) {

        curr_patient.prescriptions[i].date = req.body.date || curr_patient.prescriptions[i].date;
        curr_patient.prescriptions[i].medicine = req.body.medicine || curr_patient.prescriptions[i].medicine;
        curr_patient.prescriptions[i].duration = req.body.duration || curr_patient.prescriptions[i].duration;
        curr_patient.prescriptions[i].amount = req.body.amount || curr_patient.prescriptions[i].amount;
        curr_patient.prescriptions[i].status = req.body.status || curr_patient.prescriptions[i].status;
        
        break; 
      }
    }
    curr_patient.save();
    res.json({"edited": true});     
  };
  const sendRequest = async (req, res) => {
    try {
        console.log("Received request:", req.body);

        const { doctorEmail, patientEmail } = req.body;

        if (!doctorEmail || !patientEmail) {
            return res.status(400).json({ message: "Doctor and Patient email are required" });
        }

        // Check if request already exists
        const existingRequest = await RequestModel.findOne({ doctorEmail, patientEmail });

        if (existingRequest) {
          existingRequest.status = "pending";
          await existingRequest.save();
          return res.status(200).json({ message: "Request status updated to pending", request: existingRequest });
        }

        // Create a new request
        const newRequest = new RequestModel({ doctorEmail, patientEmail, status: "pending" });
        await newRequest.save();

        res.status(201).json({ message: "Request sent successfully", request: newRequest });
    } catch (error) {
        console.error("Error in sendRequest:", error);
        res.status(500).json({ message: "Internal Server Error.", error: error.message });
    }
};

const getRequestStatus = async (req, res) => {
  const { doctorEmail, patientEmail } = req.body;
  try {
      const request = await RequestModel.findOne({ doctorEmail, patientEmail });
      if (!request) {
          return res.status(404).json({ message: "Request not found" });
      }
      res.json({ status: request.status });
  } catch (error) {
      res.status(500).json({ message: "Server error" });
  }
};
const countUnreadNotifications = async (req, res) => {
  try {
    console.log("Fetching notifications for:", req.params.patientEmail);

    const { patientEmail } = req.params;
    if (!patientEmail) {
      return res.status(400).json({ message: "Patient email is required" });
    }

    // Fetch all notifications where isRead is missing or false
    const unreadNotifications = await Notification.find({
      patientEmail,
      $or: [{ isRead: false }, { isRead: { $exists: false } }] // Includes missing isRead
    });

    // Get the count by checking the array length
    const unreadCount = unreadNotifications.length;

    res.status(200).json({
      message: "Unread notifications count retrieved",
      count: unreadCount,
    });
  } catch (error) {
    console.error("Error in countUnreadNotifications:", error);
    res.status(500).json({ message: "Internal Server Error.", error: error.message });
  }
};



module.exports={countUnreadNotifications, getRequestStatus , sendRequest,createPatient, getPatient,updatePatient,editPrescription,deletePrescription,addPrescription};
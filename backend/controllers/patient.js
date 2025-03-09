const Patient = require("../models/patientModel");
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

module.exports={createPatient, getPatient,updatePatient,editPrescription,deletePrescription,addPrescription};
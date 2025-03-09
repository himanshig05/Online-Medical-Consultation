const Doctor = require("../models/doctorModel");
const getDoctor= async function (req, res) {
    const doctors = await Doctor.find({});
    res.json({ data: doctors });
  };
  
  const getDoctorEmail= async function (req, res) {
    const email = req.params.email;
    const doctor = await Doctor.findOne({ email: email });
    res.json(doctor);
  };
  
  const createDoctor= async function (req, res) {
    const doctor = new Doctor({
      name: req.body.name,
      age: req.body.age,
      domain: req.body.domain,
      experience: req.body.experience,
      qualifications: req.body.qualifications,
      location: req.body.location,
      hours: req.body.hours,
    });
    await doctor.save();
    res.json(doctor);
  };
  
  const createDoctorEmail= async function (req, res) {
    const doctor = new Doctor({
      email: req.params.email,
      name: req.body.name,
      age: req.body.age,
      domain: req.body.domain,
      experience: req.body.experience,
      qualifications: req.body.qualifications,
      location: req.body.location,
      hours: req.body.hours,
      picturePath: req.body.picturePath,
    });
    await doctor.save();
    res.json(doctor);
  };
  
  //doctor update
  const updateDoctor= async function (req, res) {
    const doctor = await Doctor.findOne({email: req.params.email});
    if(!doctor){
      // return res.send(404).json({"error":"Doctor not found"});
      return res.status(404).json({ "error": "Doctor not found" });
  
    }
    const updated={
          name: req.body.name??doctor.name,
          age: req.body.age??doctor.age,
          domain: req.body.domain??doctor.domain,
          experience: req.body.experience??doctor.experience,
          qualifications: req.body.qualifications??doctor.qualifications,
          location: req.body.location??doctor.location,
          hours: req.body.hours??doctor.hours,
          picturePath:req.body.picturePath??doctor.picturePath,
        };
    const doctor1=await Doctor.findOneAndUpdate({ email: req.params.email },
          { $set: updated },
          { new: true });
  
    res.json(doctor1);
  };

module.exports={getDoctor,getDoctorEmail,createDoctor,createDoctorEmail,updateDoctor};
  
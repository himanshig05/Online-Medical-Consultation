const DoctorPay = require("../models/doctorPaymentModel.js");
const PatientPay = require("../models/patientPaymentModel.js"); 
const Stripe = require("stripe");
const  baseUrl  = require ("../url.js");
const dotenv = require("dotenv");

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const initiatePayment = async (req, res) => {
  try {
    const { patientEmail } = req.params;
    const { amount, doctorEmail } = req.body;
    const transaction = { date: new Date(), amount, status: 'pending' };

    const amountInPaise = parseInt(amount, 10) * 100;
    console.log("amount : ",amountInPaise);
    console.log("amount type : ", typeof amountInPaise);

    // PATIENT SIDE
    const patient = await PatientPay.findOne({ patientEmail });

    if (patient) {
      const existingDoctorPayment = patient.payments.find(p => p.doctorEmail === doctorEmail);

      if (existingDoctorPayment) {
        // Doctor already exists → push into transactions array
        await PatientPay.updateOne(
          { patientEmail, "payments.doctorEmail": doctorEmail },
          {
            $push: { "payments.$.transactions": transaction }
          }
        );
      } else {
        // Doctor doesn't exist → push new payment object
        await PatientPay.updateOne(
          { patientEmail },
          {
            $push: {
              payments: {
                doctorEmail,
                transactions: [transaction]
              }
            }
          }
        );
      }
    } else {
      // No patient document → create new
      await PatientPay.create({
        patientEmail,
        payments: [{ doctorEmail, transactions: [transaction] }]
      });
    }

    // DOCTOR SIDE
    const doctor = await DoctorPay.findOne({ doctorEmail });

    if (doctor) {
      const existingPatientPayment = doctor.payments.find(p => p.patientEmail === patientEmail);

      if (existingPatientPayment) {
        // Patient already exists → push into transactions array
        await DoctorPay.updateOne(
          { doctorEmail, "payments.patientEmail": patientEmail },
          {
            $push: { "payments.$.transactions": transaction }
          }
        );
      } else {
        // Patient doesn't exist → push new payment object
        await DoctorPay.updateOne(
          { doctorEmail },
          {
            $push: {
              payments: {
                patientEmail,
                transactions: [transaction]
              }
            }
          }
        );
      }
    } else {
      // No doctor document → create new
      await DoctorPay.create({
        doctorEmail,
        payments: [{ patientEmail, transactions: [transaction] }]
      });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'INR',
            product_data: {
              name: `Payment by: ${patientEmail} to ${doctorEmail}`,
            },
            unit_amount: amountInPaise,
          },
          quantity: 1,
        },
      ],
      metadata: { patientEmail, doctorEmail, amount },
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/cancel`,
    });

    res.json({ success: true, id: session.id, amount });

  } catch (error) {
    console.error("Payment initiation failed:", error);
    res.status(500).json({ success: false, error: "Failed to process payment" });
  }
};


const updateFeeStatus = async (req, res) => {
  const { sessionId } = req.body;

  if (!sessionId) {
    return res.status(400).json({ error: "Invalid sessionId" });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === 'paid') {
      const { patientEmail, doctorEmail, amount } = session.metadata;

      const parsedAmount = Number(amount);

      // Update Patient's Payment
      const patientRecord = await PatientPay.findOne({
        patientEmail,
        "payments.doctorEmail": doctorEmail,
      });

      if (patientRecord) {
        let updated = false;
        for (let paymentGroup of patientRecord.payments) {
          if (paymentGroup.doctorEmail === doctorEmail) {
            for (let transaction of paymentGroup.transactions) {
              if (transaction.amount === parsedAmount && transaction.status === "pending") {
                transaction.status = "paid";
                updated = true;
                break;
              }
            }
          }
        }

        if (updated) {
          patientRecord.markModified('payments'); 
          await patientRecord.save();
          console.log("Patient transaction updated");
        } else {
          console.log("No matching patient transaction found");
        }
      } else {
        console.log("No matching patientRecord found");
      }

      // Update Doctor's Payment
      const doctorRecord = await DoctorPay.findOne({
        doctorEmail,
        "payments.patientEmail": patientEmail,
      });

      if (doctorRecord) {
        let updated = false;
        for (let paymentGroup of doctorRecord.payments) {
          if (paymentGroup.patientEmail === patientEmail) {
            for (let transaction of paymentGroup.transactions) {
              if (transaction.amount === parsedAmount && transaction.status === "pending") {
                transaction.status = "paid";
                updated = true;
                break;
              }
            }
          }
        }

        if (updated) {
          doctorRecord.markModified('payments'); 
          await doctorRecord.save();
          console.log("Doctor transaction updated");
        } else {
          console.log("No matching doctor transaction found");
        }
      } else {
        console.log("No matching doctorRecord found");
      }

      res.status(200).json({ success: true, message: "Fee status updated successfully" });
    } else {
      console.log('Payment not completed for sessionId:', sessionId);
      res.status(400).json({ error: "Payment not completed" });
    }
  } catch (error) {
    console.error("Failed to update payment status:", error);
    res.status(500).json({ error: error.message });
  }
};


const getPatientPaymentHistory = async (req, res) => { //patient side
  const { patientEmail } = req.params;

  try {
      const paymentDetails = await PatientPay.findOne({ patientEmail });

      if (!paymentDetails) {
          return res.json({ message: "No payment details found for this patient." });
      }

      // Directly returning the grouped doctor-wise data
      res.status(200).json(paymentDetails.payments.reverse());


  } catch (error) {
      console.error("Error fetching patient payment history:", error);
      res.status(500).send("An error occurred while fetching payment history.");
  }
};


const getDoctorPaymentHistory = async (req, res) => { //doctor side
  const { doctorEmail } = req.params;

  try {
      const paymentDetails = await DoctorPay.findOne({ doctorEmail });

      if (!paymentDetails) {
          return res.json({ message: "No payment details found for this doctor." });
      }

      // Directly returning the grouped patient-wise data
      res.status(200).json(paymentDetails.payments.reverse());


  } catch (error) {
      console.error("Error fetching doctor payment history:", error);
      res.status(500).send("An error occurred while fetching payment history.");
  }
};

module.exports={initiatePayment, updateFeeStatus ,  getPatientPaymentHistory,getDoctorPaymentHistory};

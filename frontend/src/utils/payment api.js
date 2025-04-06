import axios from "axios";

const BASE_URL = "http://localhost:5000/payment";

export const initiatePayment = async (patientName, patientEmail, doctorName, doctorEmail, amount) => {
  try {
    const response = await axios.post(`${BASE_URL}/paynow/${patientName}/${patientEmail}`, {
      doctorName,
      doctorEmail,
      amount,
    });

    return response.data;
  } catch (error) {
    console.error("Error initiating payment:", error);
    throw error;
  }
};

export const updateFeeStatus = async (paymentId, status) => {
  try {
    const response = await axios.post(`${BASE_URL}/updateStatus`, { paymentId, status });
    return response.data;
  } catch (error) {
    console.error("Error updating fee status:", error);
    throw error;
  }
};


export const getPatientHistory = async (patientEmail) => {
  try {
    const response = await axios.get(`${BASE_URL}/view-patient/${patientEmail}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching patient history:", error);
    return { success: false, error: error.message }; 
  }
};


export const getDoctorHistory = async (doctorEmail) => {
  try {
    const response = await axios.get(`${BASE_URL}/view-doctor/${doctorEmail}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching doctor history:", error);
    throw error;
  }
};

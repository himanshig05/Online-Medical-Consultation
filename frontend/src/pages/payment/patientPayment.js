import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { BASE_URL } from "../../helper.js";

const PatientPayment = () => {
  const [form, setForm] = useState({
   // patientName: "",
    patientEmail: "",
    doctorName: "",
    doctorEmail: "",
    amount: "",
  });

  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${BASE_URL}/payment/initiate/${form.patientName}/${form.patientEmail}`,
        {
          doctorName: form.doctorName,
          doctorEmail: form.doctorEmail,
          amount: form.amount,
        }
      );

      if (response.data.success) {
        window.location.href = `https://checkout.stripe.com/pay/${response.data.id}`;
      }
    } catch (error) {
      console.error("Payment initiation failed", error);
      router.push("/failure");
    }
  };

  return (
    <div>
      <h2>Patient Payment</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="patientName" placeholder="Patient Name" required onChange={handleChange} />
        <input type="email" name="patientEmail" placeholder="Patient Email" required onChange={handleChange} />
        <input type="text" name="doctorName" placeholder="Doctor Name" required onChange={handleChange} />
        <input type="email" name="doctorEmail" placeholder="Doctor Email" required onChange={handleChange} />
        <input type="number" name="amount" placeholder="Amount (INR)" required onChange={handleChange} />
        <button type="submit">Proceed to Pay</button>
      </form>
    </div>
  );
};

export default PatientPayment;

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
const EditForm = () => {
  const { data: session } = useSession();
  const [age, setAge] = useState("");
  const [domain, setDomain] = useState("");
  const [experience, setExperience] = useState("");
  const [qualifications, setQualifications] = useState("");
  const [location, setLocation] = useState("");
  const [hours, setHours] = useState("");
  const router = useRouter();

  const updateDoctor = (e) => {
    const n = router.query.name;
    fetch(`http://127.0.0.1:5000/update/${n}`, {
      method: "POST",
      body: JSON.stringify({
        age: age,
        domain: domain,
        experience: experience,
        qualifications: qualifications,
        location: location,
        hours: hours,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        alert("Updated profile");
        console.log(data);
      })
      .catch((error) => {
        alert("Error");
        console.log(error);
      });
  };

  return (
    <div>
      <form method="post">
        <label>Age: </label>
        <input
          onChange={(e) => {
            setAge(e.target.value);
          }}
          type="number"
          name="age"
          style={{ color: "black" }}
        />
        <br />
        <label>Domain: </label>
        <input
          onChange={(e) => {
            setDomain(e.target.value);
          }}
          type="text"
          name="domain"
          style={{ color: "black" }}
        />
        <br />
        <label>Experience: </label>
        <input
          onChange={(e) => {
            setExperience(e.target.value);
          }}
          type="number"
          name="experience"
          style={{ color: "black" }}
        />
        <br />
        <label>Qualifications: </label>
        <input
          onChange={(e) => {
            setQualifications(e.target.value);
          }}
          type="text"
          name="qualifications"
          style={{ color: "black" }}
        />
        <br />
        <label>Location: </label>
        <input
          onChange={(e) => {
            setLocation(e.target.value);
          }}
          type="text"
          name="location"
          style={{ color: "black" }}
        />
        <br />
        <label>Available Hours: </label>
        <input
          onChange={(e) => {
            setHours(e.target.value);
          }}
          type="text"
          name="hours"
          style={{ color: "black" }}
        />
        <br />
        <button
          onClick={(e) => {
            updateDoctor(e);
          }}
          type="submit"
          style={{ backgroundColor: "white", color: "black" }}
        >
          Edit Details
        </button>
      </form>
      <button style={{ backgroundColor: "white", color: "black" }}>
        <Link href={"/DoctorTable"}>Show Doctor Table</Link>
      </button>
    </div>
  );
};

export default EditForm;

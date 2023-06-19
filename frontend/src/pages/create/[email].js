import React, { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
const DoctorForm = () => {
  const { data: session } = useSession();
  const [name, setName] = useState("");
  const [age, setAge] = useState();
  const [domain, setDomain] = useState("");
  const [experience, setExperience] = useState();
  const [qualifications, setQualifications] = useState("");
  const [location, setLocation] = useState("");
  const [hours, setHours] = useState("");
  const router = useRouter();

  const createDoctor = (e) => {
    const email = router.query.email;
    fetch(`http://127.0.0.1:5000/create/${email}`, {
      method: "POST",
      body: JSON.stringify({
        email: email,
        name: name,
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
        alert("Created profile");
        console.log(data);
      })
      .catch((error) => {
        alert("Error");
        console.log(error);
      });
    router.push(`/find/${email}`);
  };

  return (
    <div>
      <form method="post">
        <label>Name: </label>
        <input
          onChange={(e) => {
            setName(e.target.value);
          }}
          type="text"
          name="name"
          style={{ color: "black" }}
        />
        <br />
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
            createDoctor(e);
          }}
          type="submit"
          style={{ backgroundColor: "white", color: "black" }}
        >
          Add Details
        </button>
      </form>
    </div>
  );
};

export default DoctorForm;

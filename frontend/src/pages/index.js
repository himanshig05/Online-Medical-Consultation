import Image from "next/image";
import { Inter } from "next/font/google";
import LoginPage from "../components/LoginPage.jsx";
const inter = Inter({ subsets: ["latin"] });
import { useEffect } from "react";
import { BASE_URL } from "../helper.js";
import Head from "next/head";

export default function Home() {
  useEffect(() => {
    getResponse().then((data) => {
      console.log(data);
    });
  }, []);
  async function getResponse() {
    const response = await fetch(`${BASE_URL}/search`);
    console.log(response);
    if (!response.ok) {
      console.log(err);
    }
    const data = await response.json();
    return data;
  }

  return (
    <>
      <Head>
        <title>MediCare</title>
        <link rel="icon" href="/MEDICARE.png" />
      </Head>
      <div>
        <LoginPage />
      </div>
    </>
  );
}

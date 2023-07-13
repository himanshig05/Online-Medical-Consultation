import Image from 'next/image'
import { Inter } from 'next/font/google'
import Login from '../components/Login'
const inter = Inter({ subsets: ['latin'] })
import { useEffect } from 'react'

export default function Home() {

   useEffect(() => {
     getResponse().then((data) => {
       console.log(data);
     });
   }, []);
   async function getResponse() {
     const response = await fetch("http://127.0.0.1:5000/search");
     console.log(response);
     if (!response.ok) {
       console.log(err);
     }
     const data = await response.json();
     return data;
   }

  return (
    <>
    <div>
      <Login/>
    </div>
    </>
  )
}

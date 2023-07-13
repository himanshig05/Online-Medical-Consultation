import React from 'react'
import { useSession } from "next-auth/react";
import LoginPage from "../components/LoginPage.jsx";
import Messenger from '../components/MessengerComponent';

const MessengerPage = () => {
    const { data: session } = useSession();
    if (!session) {
      return <LoginPage />
    }
    else {
        return <Messenger/>
    }
}

export default MessengerPage;
import React from 'react'
import { useSession } from "next-auth/react";
import Login from "../components/login";
import Messenger from '../components/MessengerComponent';

const MessengerPage = () => {
    const { data: session } = useSession();
    if (!session) {
      return <Login/>
    }
    else {
        return <Messenger/>
    }
}

export default MessengerPage;
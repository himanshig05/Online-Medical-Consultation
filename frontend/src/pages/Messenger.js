import React from 'react'
import { useSession } from "next-auth/react";
import Login from "../components/login";
import Messenger from '../components/Messenger';

const messenger = () => {
    const { data: session } = useSession();
    if (!session) {
      return <Login/>
    }
    else {
        return <Messenger/>
    }
}

export default messenger
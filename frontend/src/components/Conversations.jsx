import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
//import "./Conversations.css";

const Conversation = ({ conversation }) => {
  const { data: session } = useSession();
  const receiver = conversation.members.find((m) => m !== session.user.email);

  if (!receiver) {
    return null;
  }

  return (
    <div className="conversation">
      <img
        className="conversationImg"
        src="https://images.pexels.com/photos/3686769/pexels-photo-3686769.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
        alt=""
      />
      <span className="conversationName">{receiver}</span>
    </div>
  );
};

export default Conversation;

import React, {useState, useEffect} from "react";
//import "./Message.css";
import { useRouter } from "next/router";
import TimeAgo from "react-timeago";
import { BASE_URL } from "../helper.js";

const Message = ({ message, own }) => {
  const router = useRouter();
  const [user, setUser] = useState();
  const index = message?.sender.indexOf("@");
  const check = message?.sender.slice(index);

  if (check == "@pec.edu.in") {
    useEffect(() => {
      if (router.isReady) {
        fetch(`${BASE_URL}/search/${message?.sender}`, {
          method: "GET",
        })
          .then((res) => res.json())
          .then((data) => {
            setUser(data);
          });
      }
    }, [router.isReady]);
  } else {
    useEffect(() => {
      if (router.isReady) {
        fetch(`${BASE_URL}/patientProfile/${message?.sender}`, {
          method: "GET",
        })
          .then((res) => res.json())
          .then((data) => {
            setUser(data);
          });
      }
    }, [router.isReady]);
  }


  return (
    <div className={own ? "message own" : "message"}>
      <div className="messageTop">
        <img className="messageImg" src={user?.picturePath} alt="" />
        <p className="messageText">{message?.text}</p>
      </div>
      <div className="messageBottom">
        <TimeAgo date={message?.createdAt} />
      </div>
    </div>
  );
};

export default Message;

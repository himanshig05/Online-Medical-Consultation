import React, { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
//import "./Messenger.css";
import Conversation from "./Conversations";
import Message from "./Message";
import { io } from "socket.io-client";
import { IoChevronBackOutline } from "react-icons/io5";
import { BASE_URL } from "../helper.js";
import Link from "next/link";

const Messenger = () => {

 const { data: session } = useSession();
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
    const socket = useRef();
    const scrollRef = useRef();

   useEffect(() => {
     socket.current = io(`${BASE_URL}`);
     socket.current.on("getMessage", (data) => {
       setArrivalMessage({
         sender: data.senderId,
         text: data.text,
         createdAt: Date.now(),
       });
     });
   }, []);


  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

    useEffect(() => {
      socket.current.emit("addUser", session.user.email);
      socket.current.on("getUsers", (users) => {
        setOnlineUsers(
          users
          /*loggedInUser.friends.filter((f) => users.some((u) => u.userId === f))*/
        );
      });
    }, [session.user.email]);

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/conversations/${session.user.email}`,
          {
            method: "GET",
          }
        );
        const data = await res.json();
        setConversations(data);
      } catch (err) {
        console.log(err);
      }
    };
    getConversations();
  }, [session.user.email]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/messages/${currentChat?._id}`,
          {
            method: "GET",
          }
        );
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.log(err);
      }
    };
    getMessages();
  }, [currentChat]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const receiverId = currentChat.members.find(
      (member) => member !== session.user.email
    );

     socket.current.emit("sendMessage", {
       senderId: session.user.email,
       receiverId,
       text: newMessage,
     });


    try {
      const res = await fetch(`${BASE_URL}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender: session.user.email,
          text: newMessage,
          conversationId: currentChat._id,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          setMessages([...messages, data]);
          setNewMessage("");
        });
    } catch (err) {
      console.log(err);
    }
    };
    
    useEffect(() => {
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);


  return (
    <>
      <div className="messenger bg-white">
        <div className="chatMenu">
          <div className="chatMenuWrapper border-2 border-b-2">
            <a href="/"> <div className="text-black text-lg flex items-center"><IoChevronBackOutline/>Back</div></a>
            {/* <div className="flex items-center justify-between">
            <div className="text-2xl text-black justify-start">Back</div> */}
            <div className="text-2xl font-bold text-black flex justify-center">Your Chats</div>
            {/* </div> */}
            {conversations.map((c) => (
              <>
              <div className="text-black text-lg font-semibold border-b-2" onClick={() => setCurrentChat(c)}>
                <Conversation conversation={c} />
              </div>
                </>
            ))}
          </div>
        </div>
        <div className="chatBox">
          <div className="chatBoxWrapper">
            {currentChat ? (
              <>
                <div className="chatBoxTop pl-4">
                  {messages.map((m) => (
                    <div ref={scrollRef}>
                      <Message
                        message={m}
                        own={m?.sender === session.user.email}
                      />
                    </div>
                  ))}
                </div>
                <div className="chatBoxBottom space-x-12 pl-5">
                  <textarea
                    className="chatMessageInput w-full rounded-full border border-gray-200 p-6 bg-gray-100"
                    placeholder="Write Something..."
                    onChange={(e) => setNewMessage(e.target.value)}
                    value={newMessage}
                  ></textarea>
                  <button className="chatSubmitButton" onClick={handleSubmit}>
                    Send
                  </button>
                </div>
              </>
            ) : (
              <span className="noConversationText text-black flex justify-center items-center">
                Open a conversation to start a chat
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Messenger;

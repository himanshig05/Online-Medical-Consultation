import React, { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
//import "./Messenger.css";
import Conversation from "./Conversations";
import Message from "./Message";
import { io } from "socket.io-client";


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
     socket.current = io("ws://localhost:7000");
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
          `http://localhost:5000/conversations/${session.user.email}`,
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
          `http://localhost:5000/messages/${currentChat?._id}`,
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
      const res = await fetch(`http://localhost:5000/messages`, {
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
      <div className="messenger">
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            <div style={{ fontSize: "20px" }}>Your Chats</div>
            {conversations.map((c) => (
              <div onClick={() => setCurrentChat(c)}>
                <Conversation conversation={c} />
              </div>
            ))}
          </div>
        </div>
        <div className="chatBox">
          <div className="chatBoxWrapper">
            {currentChat ? (
              <>
                <div className="chatBoxTop">
                  {messages.map((m) => (
                    <div ref={scrollRef}>
                      <Message
                        message={m}
                        own={m?.sender === session.user.email}
                      />
                    </div>
                  ))}
                </div>
                <div className="chatBoxBottom">
                  <textarea
                    className="chatMessageInput"
                    placeholder="write something..."
                    onChange={(e) => setNewMessage(e.target.value)}
                    value={newMessage}
                  ></textarea>
                  <button className="chatSubmitButton" onClick={handleSubmit}>
                    Send
                  </button>
                </div>
              </>
            ) : (
              <span className="noConversationText">
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

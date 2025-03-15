import React, { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { io } from "socket.io-client";
import { IoChevronBackOutline } from "react-icons/io5";
import { BASE_URL } from "../helper.js";
import Link from "next/link";
import { useTheme } from "../../context/ThemeContext";
import { FaMoon, FaSun } from "react-icons/fa";
import Conversation from "./Conversations";
import Message from "./Message";
import { useContext } from "react";


const Messenger = () => {
  const { data: session, status } = useSession();
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const socket = useRef();
  const scrollRef = useRef();
  const { theme, toggleTheme } = useTheme();


// console.log("Theme:", theme);
// console.log("toggleTheme:", setTheme);


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
    if (arrivalMessage && currentChat?.members.includes(arrivalMessage.sender)) {
      setMessages((prev) => [...prev, arrivalMessage]);
    }
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    if (session) {
      socket.current.emit("addUser", session.user.email);
      socket.current.on("getUsers", (users) => {
        setOnlineUsers(users);
      });
    }
  }, [session]);

  useEffect(() => {
    const getConversations = async () => {
      if (!session) return;
      try {
        const res = await fetch(`${BASE_URL}/conversations/${session.user.email}`, {
          method: "GET",
        });
        const data = await res.json();
        setConversations(data);
      } catch (err) {
        console.log(err);
      }
    };
    getConversations();
  }, [session]);

  useEffect(() => {
    const getMessages = async () => {
      if (!currentChat) return;
      try {
        const res = await fetch(`${BASE_URL}/messages/${currentChat?._id}`, {
          method: "GET",
        });
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
    if (!session || !currentChat || newMessage.trim() === "") return;

    const receiverId = currentChat.members.find((member) => member !== session.user.email);

    socket.current.emit("sendMessage", {
      senderId: session.user.email,
      receiverId,
      text: newMessage,
    });

    try {
      const res = await fetch(`${BASE_URL}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender: session.user.email,
          text: newMessage,
          conversationId: currentChat._id,
        }),
      });

      const data = await res.json();
      setMessages([...messages, data]);
      setNewMessage("");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (status === "loading") return <p>Loading...</p>;
  if (!session) return <p>Please sign in to access Messenger.</p>;

  return (
    <div className={`messenger ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
      <div className="chatMenu">
        <div className="chatMenuWrapper border-2 border-b-2">
          <div className="flex justify-between items-center p-2">
            <Link href="/">
              <div className="text-lg flex items-center cursor-pointer">
                <IoChevronBackOutline />
                Back
              </div>
            </Link>
            <div className="text-2xl font-bold">Your Chats</div>

            {/* Dark Mode Toggle */}
            <button
  className="p-2 rounded-full transition-all hover:scale-110"
  onClick={toggleTheme}
>
  {theme === "dark" ? <FaSun size={24} /> : <FaMoon size={24} />}
</button>

          </div>

          {conversations.map((c, index) => (
            <div
              key={index}
              className={`text-lg font-semibold border-b-2 cursor-pointer ${
                theme === "dark" ? "text-white" : "text-black"
              }`}
              onClick={() => setCurrentChat(c)}
            >
              <Conversation conversation={c} />
            </div>
          ))}
        </div>
      </div>

      <div className="chatBox">
        <div className="chatBoxWrapper">
          {currentChat ? (
            <>
              <div className="chatBoxTop pl-4">
                {messages.map((m, index) => (
                  <div key={index} ref={scrollRef}>
                    <Message message={m} own={m?.sender === session.user.email} />
                  </div>
                ))}
              </div>
              <div className="chatBoxBottom space-x-12 pl-5">
                <textarea
                  className={`chatMessageInput w-full rounded-full border p-6 bg-gray-100 ${
                    theme === "dark" ? "border-gray-600 bg-gray-800 text-white" : "border-gray-200"
                  }`}
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
            <span className="noConversationText flex justify-center items-center">
              Open a conversation to start a chat
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messenger;

"use client";
import { useChat } from "@ai-sdk/react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useEffect, useRef } from "react";
import VoiceSearch from "../utils/voicespeech.jsx";

export default function HelpChat({ onClose }) {
  const {
    messages,
    input,
    handleInputChange,
    status,
    handleSubmit,
    stop,
    reload,
    error,
  } = useChat({ api: "/api/gemini" });

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const speak = (text) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 w-[400px] p-6 bg-gradient-to-br from-purple-600 via-blue-600 to-red-500 text-white shadow-2xl rounded-2xl z-50 font-sans border border-gray-300 transition-all transform scale-105 animate-gradient-move">
      <div className="flex justify-between items-center mb-3 border-b pb-2 border-gray-400">
        <h2 className="text-xl font-semibold text-white">Helpline</h2>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-300 text-xl focus:outline-none"
        >
          ✕
        </button>
      </div>
      <div className="max-h-[350px] overflow-y-auto mb-3 pr-1 space-y-2">
        {messages?.length === 0 && (
          <p className="text-gray-200 text-center">Please ask your queries here!</p>
        )}
        {messages?.map((message, index) => (
          <div
            key={index}
            className={`flex flex-col gap-1 ${
              message.role === "user" ? "items-end" : "items-start"
            }`}
          >
            <div
              className={`p-3 rounded-lg max-w-[80%] shadow-md ${
                message.role === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-purple-700 text-gray-100"
              }`}
            >
              <Markdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ inline, children, ...props }) {
                    return inline ? (
                      <code {...props} className="bg-gray-700 px-1 py-0.5 rounded-md text-sm">
                        {children}
                      </code>
                    ) : (
                      <pre className="bg-gray-800 p-3 rounded-md text-sm text-gray-200">
                        <code {...props}>{children}</code>
                      </pre>
                    );
                  },
                  ul: ({ children }) => (
                    <ul className="pl-5 list-disc text-gray-300">{children}</ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="pl-5 list-decimal text-gray-300">{children}</ol>
                  ),
                }}
              >
                {message.content}
              </Markdown>
            </div>
            {message.role !== "user" && (
              <button
                className="mt-1 px-3 py-1 flex items-center gap-1 bg-white/20 backdrop-blur-md text-white text-xs font-semibold rounded-full shadow-md 
                hover:bg-white/30 hover:scale-105 active:scale-95 transition-all duration-300 ease-in-out"
                onClick={() => speak(message.content)}
              >
                <span role="img" aria-label="speaker" className="animate-bounce">🔊</span> Read Aloud
              </button>
            )}
          </div>
        ))}
        {status === "loading" && (
          <div className="text-center mt-2">
            <p className="text-gray-200">Loading...</p>
            <button
              type="button"
              onClick={() => stop()}
              className="mt-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 font-bold"
            >
              Stop
            </button>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex flex-col gap-2">
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <textarea
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message here..."
            className="w-full h-24 p-3 rounded-lg border border-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-sm bg-gray-800 text-white"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-500 font-bold transition"
              disabled={status === "loading"}
            >
              {status === "loading" ? "Loading..." : "Ask"}
            </button>
            <VoiceSearch onSearch={(text) => handleInputChange({ target: { value: text } })} />
          </div>
        </form>

        {error && (
          <div className="text-center text-red-300 mt-2">
            <p>Error</p>
            <button
              type="button"
              onClick={() => reload()}
              className="mt-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 font-bold"
            >
              Retry
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

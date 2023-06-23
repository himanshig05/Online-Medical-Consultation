import { useState, useRef } from "react";

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() !== "") {
      setMessages([...messages, { text: inputValue, file }]);
      setInputValue("");
      setFile(null);
    }
  };

  const handleAddFileClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          flex: 1,
          padding: "20px",
          backgroundColor: "#f5f5f5",
          overflowY: "scroll",
        }}
      >
        {messages.map((message, index) => (
          <div
            key={index}
            style={{
              marginBottom: "10px",
              backgroundColor: "#e1e1e1",
              padding: "10px",
              borderRadius: "5px",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              color: "#333",
            }}
          >
            {message.text}
            {message.file && (
              <div>
                File: {message.file.name} ({message.file.size} bytes)
              </div>
            )}
          </div>
        ))}
      </div>
      <form
        style={{
          display: "flex",
          marginTop: "10px",
          borderTop: "1px solid #ccc",
          padding: "10px",
        }}
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          placeholder="Type your message..."
          style={{
            flex: 1,
            padding: "8px",
            border: "1px solid #ccc",
            borderRadius: "3px",
            marginRight: "10px",
            fontSize: "14px",
            color:"black"
          }}
          value={inputValue}
          onChange={handleInputChange}
        />
        <input
          type="file"
          style={{ display: "none" }}
          onChange={handleFileChange}
          ref={fileInputRef}
        />
        <button
          type="button"
          style={{
            padding: "8px 16px",
            border: "none",
            borderRadius: "3px",
            backgroundColor: "#0070f3",
            color: "#fff",
            fontSize: "14px",
            fontWeight: "bold",
            textTransform: "uppercase",
            cursor: "pointer",
            marginRight: "10px",
          }}
          onClick={handleAddFileClick}
        >
          Add File
        </button>
        <button
          type="submit"
          style={{
            padding: "8px 16px",
            border: "none",
            borderRadius: "3px",
            backgroundColor: "#0070f3",
            color: "#fff",
            fontSize: "14px",
            fontWeight: "bold",
            textTransform: "uppercase",
            cursor: "pointer",
          }}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatInterface;

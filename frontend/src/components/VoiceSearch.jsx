import React, { useState, useRef } from "react";
import { FaMicrophone } from "react-icons/fa";

const VoiceSearch = ({ onSearch, onStop }) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.error("Speech recognition is not supported in this browser.");
      alert("Speech recognition is not supported in your browser.");
      return;
    }

    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.lang = "en-IN";
    recognitionRef.current.interimResults = false;
    recognitionRef.current.maxAlternatives = 1;
    recognitionRef.current.continuous = true; 
    recognitionRef.current.onstart = () => {
      console.log("Listening...");
      setIsListening(true);
    };

    recognitionRef.current.onend = () => {
      console.log("Stopped listening.");
      setIsListening(false);
    
      if (!onStop) {
       
      }
    };

    recognitionRef.current.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      alert("Error occurred during speech recognition.");
      setIsListening(false);
    };

    recognitionRef.current.onresult = (event) => {
      let transcript = event.results[0][0].transcript;
      console.log("Recognized Speech (Before Processing):", transcript);

     
      transcript = transcript
        .replace(/[\.\,\?]/g, "")  //  this is to remove periods, commas, and question marks
        .trim()  //  this is to remove unnecessary spaces
        .toLowerCase(); // this to convert to lowercase for better matching

      console.log("Recognized Speech (After Processing):", transcript);
      onSearch(transcript);
    };

    recognitionRef.current.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  React.useEffect(() => {
    if (onStop) {
      stopListening();
    }
  }, [onStop]);

  return (
    <button
      className={`absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full transition-all ${
        isListening
          ? "bg-blue-500 shadow-lg animate-pulse scale-90"
          : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
      }`}
      onClick={startListening}
      disabled={isListening} 
    >
      <FaMicrophone size={16} className="text-white" />
    </button>
  );
};

export default VoiceSearch;

import { useState } from "react";

const VoiceSearch = ({ onSearch }) => {
    const [isListening, setIsListening] = useState(false);
    let speechDetected=false;
    const startListening = () => {
        const SpeechRecognition =
            window.SpeechRecognition || window.webkitSpeechRecognition;//chrome uses webkit

        if (!SpeechRecognition) {
            console.error("Speech recognition is not supported in this browser.");
            alert("Speech recognition is not supported in your browser.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = "en-IN";
        recognition.interimResults = false;//the final result, not interims
        recognition.maxAlternatives = 1;//the best result
        recognition.onstart = () => {
            console.log("Listening");
            setIsListening(true);
        };

        recognition.onend = () => {
            console.log("Stopped listening");
            setIsListening(false);
            if(!speechDetected)
                return alert("No speech detected! Try again");
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error);
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            speechDetected=true;
            console.log("Recognized Speech:", transcript);
            onSearch(transcript);
        };

        recognition.start();
        
    };

    return (
        <button onClick={startListening} className="mic-button">
            {isListening ? "🎤 Listening..." : "🎙️ Start Voice Search"}
        </button>
    );
};

export default VoiceSearch;

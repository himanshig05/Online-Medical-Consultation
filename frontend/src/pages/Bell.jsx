import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { BASE_URL } from "../helper.js";
const Bell = ({ doctorEmail }) => {
    const [pendingCount, setPendingCount] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (!doctorEmail) return;

        const fetchPendingRequests = async () => {
            try {
                const response = await fetch(`${BASE_URL}/api/requests/pending/count/${doctorEmail}`);

                if (!response.ok) {
                    throw new Error("Failed to fetch pending requests");
                }
                const data = await response.json();
                setPendingCount(data.count);
            } catch (error) {
                console.error("Error fetching pending requests:", error);
                setPendingCount(0);
            }
        };

        fetchPendingRequests();
    }, [doctorEmail]);

    const handleReviewClick = () => {
        router.push("/DoctorRequests"); // Open DoctorRequests.jsx
    };

    return (
        <div style={{ position: "relative", display: "inline-block" }}>
            {/* Bell Icon */}
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                style={{
                    fontSize: "24px", 
                    cursor: "pointer", 
                    background: "none", 
                    border: "none",
                    position: "relative",
                    transition: "transform 0.3s ease",
                }}
                className={isOpen ? "bell-shake" : ""}
            >
                🔔
                {/* Notification Badge (Shown Only If Count > 0) */}
                {pendingCount > 0 && (
                    <span style={{
                        position: "absolute",
                        top: "-3px",
                        right: "-3px",
                        backgroundColor: "#6495ED", // Changed to blue
                        color: "white",
                        fontSize: "10px",  
                        fontWeight: "bold",
                        borderRadius: "50%",
                        padding: "3px 6px", 
                        minWidth: "16px",  
                        textAlign: "center",
                        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
                    }}>
                        {pendingCount}
                    </span>
                )}
            </button>

            {/* Pop-up Notification */}
            {isOpen && (
                <div style={{
                    position: "absolute",
                    top: "40px",
                    right: "-20px",
                    background: "linear-gradient(135deg, #87CEEB, #6495ED)", // Changed to blue shades
                    borderRadius: "10px",
                    boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.2)",
                    padding: "14px 18px",
                    minWidth: "250px",
                    fontSize: "15px",
                    fontWeight: "500",
                    color: "#fff",
                    textAlign: "center",
                    zIndex: "1000",
                    animation: "fadeIn 0.3s ease-in-out",
                }}>
                    <p style={{ marginBottom: "10px", textTransform: "none" }}>
                        {pendingCount > 0 
                            ? <>🔔 You have <strong>{pendingCount}</strong> pending request(s). Please review them.</>
                            : "✅ You have no pending requests."}
                    </p>
                    {pendingCount > 0 && (
                        <button 
                            onClick={handleReviewClick} 
                            style={{
                                background: "#6495ED", // Changed to blue
                                border: "none",
                                padding: "8px 12px",
                                borderRadius: "6px",
                                color: "white",
                                fontSize: "14px",
                                cursor: "pointer",
                                transition: "background 0.3s",
                            }}
                            onMouseOver={(e) => e.target.style.background = "#4682B4"}
                            onMouseOut={(e) => e.target.style.background = "#6495ED"}
                        >
                            Review requests
                        </button>
                    )}
                </div>
            )}

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .bell-shake {
                    animation: shake 0.3s ease-in-out;
                }
                @keyframes shake {
                    0% { transform: rotate(0deg); }
                    25% { transform: rotate(-10deg); }
                    50% { transform: rotate(10deg); }
                    75% { transform: rotate(-5deg); }
                    100% { transform: rotate(0deg); }
                }
            `}</style>
        </div>
    );
};

export default Bell;

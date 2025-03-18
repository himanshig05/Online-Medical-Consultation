import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { BASE_URL } from "../helper.js";

const Bell = ({ patientEmail }) => {
    const [notificationCount, setNotificationCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (!patientEmail) return;

        const fetchUnreadNotifications = async () => {
            try {
                const response = await fetch(`${BASE_URL}/api/notifications/unread/count/${patientEmail}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch unread notifications");
                }
                const data = await response.json();
                setNotificationCount(data.count);
            } catch (error) {
                console.error("Error fetching unread notifications:", error);
                setNotificationCount(0);
            }
        };

        fetchUnreadNotifications();
    }, [patientEmail]);

    const handleNotificationClick = () => {
        router.push("/PatientRequests"); // Updated to PatientRequests
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
                }}
                className={isOpen ? "bell-shake" : ""}
            >
                🔔
                {/* Notification Badge (Over the Bell) */}
                {notificationCount > 0 && (
                    <span style={{
                        position: "absolute",
                        top: "-5px",
                        right: "-2px",
                        transform: "translate(50%, -50%)",
                        backgroundColor: "#FF5733",  // Softer red
                        color: "white",
                        fontSize: "12px",
                        fontWeight: "bold",
                        borderRadius: "50%",
                        padding: "3px 6px",
                        minWidth: "18px",
                        height: "18px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        textAlign: "center",
                        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
                    }}>
                        {notificationCount}
                    </span>
                )}
            </button>

            {/* Pop-up Notification */}
            {isOpen && (
                <div style={{
                    position: "absolute",
                    top: "40px",
                    right: "-20px",
                    background: "linear-gradient(135deg, #FF8C66, #FF5733)",  // Softened hover color
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
                    <p style={{ marginBottom: "10px" }}>
                        {notificationCount > 0 
                            ? <>🔔 You have <strong>{notificationCount}</strong> unread request(s).</>
                            : "✅ No new requests."}
                    </p>
                    {notificationCount > 0 && (
                        <button 
                            onClick={handleNotificationClick} 
                            style={{
                                background: "#FF6B4A",
                                border: "none",
                                padding: "8px 12px",
                                borderRadius: "6px",
                                color: "white",
                                fontSize: "14px",
                                cursor: "pointer",
                                transition: "background 0.3s",
                            }}
                            onMouseOver={(e) => e.target.style.background = "#E85C42"}
                            onMouseOut={(e) => e.target.style.background = "#FF6B4A"}
                        >
                            View Requests
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

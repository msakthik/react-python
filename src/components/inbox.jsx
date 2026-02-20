import React, { useState } from "react";

const InboxChat = () => {
    const [messages, setMessages] = useState([
        { sender: "other", text: "Hello 👋" },
    ]);

    const [input, setInput] = useState("");

    const sendMessage = () => {
        if (!input.trim()) return;

        const newMessage = {
            sender: "me",
            text: input,
        };

        setMessages([...messages, newMessage]);
        setInput("");
    };

    return (
        <div style={styles.chatContainer}>
            <div style={styles.messageArea}>
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        style={{
                            ...styles.message,
                            alignSelf: msg.sender === "me" ? "flex-end" : "flex-start",
                            backgroundColor:
                                msg.sender === "me" ? "#007bff" : "#e4e6eb",
                            color: msg.sender === "me" ? "white" : "black",
                        }}
                    >
                        {msg.text}
                    </div>
                ))}
            </div>

            <div style={styles.inputArea}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    style={styles.input}
                    placeholder="Type a message..."
                />
                <button onClick={sendMessage} style={styles.button}>
                    Send
                </button>
            </div>
        </div>
    );
};

const styles = {
    chatContainer: {
        width: "400px",
        height: "500px",
        border: "1px solid #ccc",
        display: "flex",
        flexDirection: "column",
    },
    messageArea: {
        flex: 1,
        padding: "10px",
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
        gap: "8px",
    },
    message: {
        padding: "8px 12px",
        borderRadius: "12px",
        maxWidth: "70%",
    },
    inputArea: {
        display: "flex",
        borderTop: "1px solid #ccc",
    },
    input: {
        flex: 1,
        padding: "10px",
        border: "none",
        outline: "none",
    },
    button: {
        padding: "10px 15px",
        backgroundColor: "#007bff",
        color: "white",
        border: "none",
        cursor: "pointer",
    },
};

export default InboxChat;

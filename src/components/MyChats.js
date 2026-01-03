import React, { useState, useEffect, useRef } from "react";
import "../styles.css";
import nProgress from "nprogress";
import "nprogress/nprogress.css";
import { useLocation } from "react-router-dom";
import { useRole } from "./RoleContext";
import useEncodedTerritory from "./hooks/useEncodedTerritory";

export default function MyChats() {
  const { role, setRole, name, setName, textBox } = useRole();
  const [text, setText] = useState("");
  const [results, setResults] = useState([]);
  const [warning, setWarning] = useState("");
  const chatBoxRef = useRef(null);
  const location = useLocation();

  const { decoded } = useEncodedTerritory();

  const sendInformation = async () => {
    if (text === "") {
      return;
    }

    const isTextBoxEmpty = !textBox || textBox.trim() === "";

    const payload = {
      sender: localStorage.getItem("name"),
      sender_code: localStorage.getItem("empcode"),
      sender_territory: decoded,

      receiver: isTextBoxEmpty
        ? localStorage.getItem("user")
        : localStorage.getItem("name"),

      receiver_code: "abc", // placeholder

      receiver_territory: isTextBoxEmpty
        ? decoded
        : localStorage.getItem("territory"),

      received_date: new Date().toISOString().split("T")[0], // YYYY-MM-DD
      message: text,
    };

    try {
      await fetch("https://review-backend-bgm.onrender.com/putInfo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // append locally
      setResults((prev) => [...prev, payload]);
      setText("");
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };

  // keep your (currently disabled) fetchMessages logic intact but commented
  const fetchMessages = async () => {
    try {
      nProgress.start();
      const response = await fetch(
        "https://review-backend-bgm.onrender.com/getMessagesByTerritory",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ receiver_territory: decoded }),
        }
      );
  
      if (!response.ok) throw new Error("Failed to fetch data");
  
      const data = await response.json();
      setResults(data.results || []);
    } catch (err) {
      console.error(err);
      setWarning("Error fetching messages");
      setTimeout(() => setWarning(""), 3000);
    } finally {
      nProgress.done();
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [results]);

  return (
    <div>
      <div className="table-box">
        <div className="table-container6">
          <h2>My Info</h2>

          {/* Scrollable chat box */}
          <div className="chat-box" ref={chatBoxRef}>
            {results.length === 0 ? (
              <div className="no-messages">No messages yet</div>
            ) : (
              results.map((msg, idx) => {
                const isSent = msg.sender === localStorage.getItem("user");
                return (
                  <div
                    key={idx}
                    className={`chat-message ${isSent ? "sent" : "received"}`}
                  >
                    <div className="chat-info">
                      <span className="chat-name">
                        {isSent ? "You" : msg.sender}
                      </span>
                      <span className="chat-time">
                        {new Date(msg.received_date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="chat-text">{msg.message}</div>
                  </div>
                );
              })
            )}
          </div>

          {/* Input area */}
          <div className="message-input-container">
            <input
              type="text"
              placeholder="Type your message..."
              value={text}
              className="message-input"
              onChange={(e) => setText(e.target.value)}
            />
            <button
              className="send-button"
              onClick={sendInformation}
              disabled={!text.trim()}  
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

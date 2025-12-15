import React, { useState, useEffect, useRef } from "react";
import Subnavbar from "./Subnavbar";
import { useRole } from "./RoleContext";
import "../styles.css";
import nProgress from "nprogress";
import "nprogress/nprogress.css"; // import styles
import { useLocation } from "react-router-dom";
import useEncodedTerritory from './hooks/useEncodedTerritory';
export default function MyChats() {
  const { role, setRole, name, setName,textBox } = useRole();
  const [text, setText] = useState("");
  const [results, setResults] = useState([]);
  const [warning, setWarning] = useState("");
  const chatBoxRef = useRef(null);
const location = useLocation();
  



  // decode base64 -> original territory
  const {decoded} = useEncodedTerritory();

const sendInformation = async () => {
   if(text===''){
    return
  }
  const isTextBoxEmpty = !textBox || textBox.trim() === "";

  const payload = {
    sender: localStorage.getItem("user"),
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
    message: text
  };

  try {
    await fetch("https://review-backend-bgm.onrender.com/putInfo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    // ⬇️ Update messages locally without reload
    setResults((prev) => [...prev, payload]);

    setText(""); // Clear input after sending
  } catch (error) {
    console.error("Error sending data:", error);
  }
};


//temporary

//   const fetchMessages = async () => {
//   try {
//     nProgress.start();

    
//     const response = await fetch("https://review-backend-bgm.onrender.com/getMessagesByTerritory", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ receiver_territory: decoded }),
//     });

//     if (!response.ok) throw new Error("Failed to fetch data");

//     const data = await response.json();
//     setResults(data.results || []);
//   } catch (err) {
//     console.error(err);
//     setWarning("Error fetching messages");
//     setTimeout(() => setWarning(""), 3000);
//   } finally {
//     nProgress.done();
//   }
// };



useEffect(() => {

    // fetchMessages();
  
}, []);


  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [results]);

  return (
    <div>
      <div className="table-box">
        <div className="table-container6">
          <h2>Information</h2>

          {/* Chat Box */}
        {/* Chat Box */}
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
            <span className="chat-name">{isSent ? "You" : msg.sender}</span>
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


          {/* Input box (only if logged in) */}

  
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
    disabled={!text.trim() || text.trim()} // ⬅️ disable when text is empty
  >
    Send
  </button>
</div>

  
        </div>
      </div>
    </div>
  );
}

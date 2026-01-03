import React, { useState, useEffect, useRef } from 'react';
import Subnavbar from '../Subnavbar';
import { useRole } from '../RoleContext';
import '../../styles.css';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import useEncodedTerritory from '../hooks/useEncodedTerritory';
import useProfileTerritory from '../hooks/useProfileTerritory';
export default function Chats() {
       const { profileTerritory , profileEncodedTerritory } = useProfileTerritory();       
  
  const { role, setRole, name, setName } = useRole();
  const [text, setText] = useState('');
  const [results, setResults] = useState([]);
   const [warning, setWarning] = useState("");
  const chatBoxRef = useRef(null); // 👈 Attach this to chat box
const {decoded}=useEncodedTerritory();
const sendInformation = async () => {
  if(text===''){
    return
  }
  const payload = {
    sender: localStorage.getItem('name'),
    sender_code: localStorage.getItem('empcode'),
    sender_territory: decoded,
    receiver: localStorage.getItem('user'),
    receiver_code: 'abc', // placeholder
    receiver_territory: profileTerritory,
    received_date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
    message: text
  };
console.log('Payload to send:', payload);
  try {

    await fetch('https://review-backend-bgm.onrender.com/putInfo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    // ⬇️ Append message instantly to UI
    setResults((prev) => [...prev, payload]);

    setText(''); // Clear input after sending

  } catch (error) {
    console.error('Error sending data:', error);
  }
};

  const fetchMessages = async () => {
    const empterr=profileTerritory
    try {
      NProgress.start();
      const response = await fetch(
        "https://review-backend-bgm.onrender.com/getMessagesByTerritory",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            receiver_territory: empterr,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();
      setResults(data.results || []);
    } catch (err) {
      console.error(err);
      setWarning("Error fetching messages");
      setTimeout(() => setWarning(""), 3000);
    }
    finally{
      NProgress.done();
    }
  };

useEffect(()=>{
  fetchMessages();
},[])
  useEffect(() => {
    
    // Only scroll the chat box, not the entire page
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [results]);

  return (
    <div>
      <div className='table-box'>
        <div className='table-container6'>
          <h2>Add Information</h2>

          {/* 👇 Scrollable chat box with ref */}
<div className="chat-box" ref={chatBoxRef}>
  {results.length === 0 ? (
    <p className="no-messages">No messages yet</p>
  ) : (
    results.map((msg, index) => {
      const isSelfMessage = msg.sender === msg.receiver; // 👈 check condition
      return (
        <div
          key={index}
          className={`chat-message ${isSelfMessage ? "sent" : "received"}`}
        >
          <div className="chat-info">
            <span className="chat-name">{msg.sender}</span>
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
    disabled={!text.trim()} // ⬅️ disable when text is empty
  >
    Send
  </button>
</div>

        </div>
      </div>
    </div>
  );
}

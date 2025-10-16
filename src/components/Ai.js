
import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentDots, faTimes } from "@fortawesome/free-solid-svg-icons";

export default function Ai() {
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [table, setTable] = useState("employee_details"); // same as before
  const responseRef = useRef(null);

  const toggleWidget = () => setIsOpen(!isOpen);

  const askAi = async () => {
    if (!question.trim()) {
      alert("Please enter a question.");
      return;
    }

    try {
      setLoading(true);
      setAnswer("");

      const response = await fetch("http://localhost:8000/api/ask-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: question.trim(),
          table, // send selected table
        }),
      });

      if (!response.ok) throw new Error("Server error");

      const data = await response.json();
      setAnswer(data.answer || "No answer found.");
    } catch (err) {
      console.error("Error:", err);
      setAnswer("❌ Error: Unable to get response from AI.");
    } finally {
      setLoading(false);
    }
  };

  // Auto-scroll to bottom when answer changes
  useEffect(() => {
    if (responseRef.current) {
      responseRef.current.scrollTop = responseRef.current.scrollHeight;
    }
  }, [answer, loading]);

  return (
    <div style={{ position: "fixed", bottom: "30px", right: "30px", zIndex: 1000 }}>
      {/* 🟣 Floating "Ask AI" Button */}
      {!isOpen && (
        <button
          onClick={toggleWidget}
          style={{
            position: "fixed",
            bottom: "25px",
            right: "25px",
            background: "linear-gradient(135deg, #6a5af9, #00d4ff)",
            border: "none",
            borderRadius: "50%",
            width: "60px",
            height: "60px",
            color: "#fff",
            cursor: "pointer",
            boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
            zIndex: 1000,
          }}
          title="Ask AI"
        >
          <FontAwesomeIcon icon={faCommentDots} size="lg" />
        </button>
      )}

      {/* 💬 Expanded AI Chatbox */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "25px",
            right: "25px",
            width: "350px",
            background: "#18192F",
            color: "#e4e4ea",
            borderRadius: "12px",
            boxShadow: "0 0 20px rgba(0,0,0,0.3)",
            padding: "18px",
            zIndex: 1000,
            fontFamily: "Segoe UI, Arial, sans-serif",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <h4 style={{ color: "#6a5af9", margin: 0 }}>AI Data Assistant</h4>
            <button
              onClick={toggleWidget}
              style={{
                background: "none",
                border: "none",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              <FontAwesomeIcon icon={faTimes} size="lg" />
            </button>
          </div>

          {/* Table Dropdown */}
          <div style={{ marginBottom: "10px" }}>
            <label style={{ fontWeight: "bold", fontSize: "0.9rem" }}>
              Select :
            </label>
            <select
              value={table}
              onChange={(e) => setTable(e.target.value)}
              style={{
                width: "100%",
                background: "#1f2040",
                color: "#fff",
                border: "1px solid #444",
                borderRadius: "8px",
                padding: "8px",
                marginTop: "6px",
                fontSize: "0.95rem",
              }}
            >
              <option value="employee_details">Employee Details</option>
              <option value="commitments">Commitments</option>
              <option value="dashboard1">Metric Data</option>
            </select>
          </div>

          {/* Question Textarea */}
          <textarea
            rows={3}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Example: Who has the highest salary?"
            style={{
              width: "100%",
              background: "#1f2040",
              border: "1px solid #444",
              borderRadius: "8px",
              padding: "10px",
              color: "#fff",
              resize: "none",
              fontSize: "0.95rem",
              marginBottom: "10px",
            }}
          />

          {/* Ask Button */}
          <button
            onClick={askAi}
            disabled={loading}
            style={{
              width: "100%",
              background: "linear-gradient(90deg, #6a5af9, #00d4ff)",
              border: "none",
              borderRadius: "8px",
              padding: "10px",
              color: "#fff",
              cursor: "pointer",
              fontSize: "1rem",
              marginBottom: "10px",
            }}
          >
            {loading ? "Thinking..." : "Ask AI"}
          </button>

          {/* Scrollable Response Box */}
          <div
            ref={responseRef}
            style={{
              background: "#232345",
              borderRadius: "10px",
              padding: "12px",
              minHeight: "100px",
              maxHeight: "180px", // fixed height
              fontSize: "0.95rem",
              whiteSpace: "pre-wrap",
              overflowY: "auto", // enable scroll
            }}
          >
            <h5 style={{ color: "#48d1fd", marginTop: 0 }}>Response:</h5>
            <p style={{ margin: "6px 0 0" }}>
              {loading
                ? "Analyzing your question..."
                : answer || "Ask a question to see the result."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

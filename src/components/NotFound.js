import React, { useEffect } from "react";
import { Link,useLocation } from "react-router-dom";
import useEncodedTerritory from './hooks/useEncodedTerritory';
export default function NotFound() {
  const location = useLocation();


const {encoded}= useEncodedTerritory();
       
    
  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f3f4f6",
        fontFamily: "Segoe UI, Arial, sans-serif",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h1
          style={{
            fontSize: "4rem",
            fontWeight: "bold",
            marginBottom: "1rem",
            color: "#1f2937",
          }}
        >
          404
        </h1>
        <p
          style={{
            fontSize: "1.25rem",
            marginBottom: "1.5rem",
            color: "#4b5563",
          }}
        >
          Oops! Page not found
        </p>
         <Link
          to={encoded ? `/FinalReport?ec=${encodeURIComponent(encoded)}` : '/'}

          style={{
            color: "#2563eb",
            textDecoration: "underline",
            fontWeight: "500",
          }}
          onMouseOver={(e) => (e.target.style.color = "#1d4ed8")}
          onMouseOut={(e) => (e.target.style.color = "#2563eb")}
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}

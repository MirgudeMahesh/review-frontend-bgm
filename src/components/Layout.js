import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import { useRole } from "./RoleContext";
import ActualCommit from "./ActualCommit";
import MyChats from "./MyChats";
// import MainNavbar from "./MainNavbar";
import "../styles.css";
import useEncodedTerritory from "./hooks/useEncodedTerritory";
import Chats from "./dashboard/Chats";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { encoded } = useEncodedTerritory();
  const { role, setRole, setName, setUser, setUserRole } = useRole();

  const [showModal, setShowModal] = useState(false);

  const gotoselection = () => {
    navigate(`/Selection?ec=${encoded}`);
  };

  useEffect(() => {
    if (location.pathname === "/") {
      localStorage.removeItem("role");
      localStorage.removeItem("name");
      localStorage.removeItem("user");
      localStorage.removeItem("userRole");
      localStorage.removeItem("empName");

      setRole("");
      setName("");
      setUser("");
      setUserRole("");
    }
  }, [location.pathname, setRole, setName, setUser, setUserRole]);

  const isProfilePage = location.pathname.startsWith("/profile");
  const showUI = location.pathname !== "/";

  return (
    <>
      <div className={`layout-container ${showModal ? "blurred" : ""}`}>
        {/* fixed navbar already at top; give content some top space */}
        <div style={{ marginTop: "80px" }} />
        {/* <MainNavbar /> */}

        {/* main routed content, centered with consistent padding */}
        <main >
          <Outlet />
        </main>


        <div style={{ justifyContent: "center", alignItems: "center", display: "flex", gap: "15px", padding: "20px 0" }}>
          {showUI && (role === "BM" || role === 'BL' || role === 'BH' || role === 'SBUH') && (
            <button
              style={{
                padding: "12px 26px",
                backgroundColor: "#2c2d2e",
                color: "white",
                border: "none",
                borderRadius: "10px",
                fontSize: "18px",
                cursor: "pointer",
                boxShadow: "0px 4px 12px rgba(0,0,0,0.15)",
                transition: "background-color 0.2s ease",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#1d1e1f")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#2c2d2e")}
              onClick={gotoselection}
            >
              Review Others
            </button>
          )}

          {showUI && (role === 'SBUH' || role === 'BH' || role === 'DIR') && (
            <button
              style={{
                padding: "12px 26px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "10px",
                fontSize: "18px",
                cursor: "pointer",
                boxShadow: "0px 4px 12px rgba(0,0,0,0.15)",
                transition: "background-color 0.2s ease",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#007bff")}
              onClick={() => navigate(`/Disclosure?ec=${encoded}`)}
            >
              Compose
              <FontAwesomeIcon icon={faPaperPlane} />
            </button>
          )}
        </div>


        {/* Commitments drawer at bottom of all pages that use Layout */}
        {showUI && <ActualCommit />}

        {showUI && (
          isProfilePage ? <Chats /> : <MyChats />
        )}

      </div>

      {/* AI assistant for specific roles can be mounted here if needed */}
      {/* {showUI && role === "sbuh" && <Ai />} */}
    </>
  );
};

export default Layout;

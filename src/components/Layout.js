import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import { useRole } from "./RoleContext";
import MainNavbar from "./MainNavbar";
import ActualCommit from "./ActualCommit";
import Chats from "./dashboard/Chats";
import Ai from "./Ai";
import "../styles.css";
import useEncodedTerritory from './hooks/useEncodedTerritory';

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { decoded, encoded } = useEncodedTerritory();
  const { role, setRole, name, setName, setUser, setUserRole } = useRole();

  const [showModal, setShowModal] = useState(false);

  // Navigate to selection page
  const gotoselection = () => {
    navigate(`/Selection?ec=${encoded}`);
  };

  // Clear all session data when visiting root path
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

  // Determine UI visibility
  const hiddenPaths = ["/"];
  const shouldHideMainUI = hiddenPaths.includes(location.pathname);
  const isProfilePage = location.pathname.startsWith("/profile");
  const showUI = location.pathname !== "/";

  return (
    <>
      <div className={`layout-container ${showModal ? "blurred" : ""}`}>
        {/* Navbar spacing */}
       
        <div style={{ marginTop: "80px" }} />
 {/* <MainNavbar /> */}
        {/* Main content area */}
        <main>
          <Outlet />
        </main>

        {/* Review Others button - hidden for BE role and on login page */}
        {showUI && !['BE', 'BL', 'BH', 'SBUH'].includes(role) && (
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
              position: "fixed",
              bottom: "20px",
              right: "20px",
              zIndex: 1000
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#1d1e1f")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#2c2d2e")}
            onClick={gotoselection}
          >
            Review Others
          </button>
        )}

        {/* Actual Commit component */}
        {showUI && <ActualCommit />}

        {/* Chats component - uncomment if needed for profile pages */}
        {/* {showUI && isProfilePage && <Chats />} */}
      </div>

      {/* AI Assistant - uncomment if needed for SBUH role */}
      {/* {showUI && role === "sbuh" && <Ai />} */}
    </>
  );
};

export default Layout;

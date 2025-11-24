import React, { useState } from "react";
import { useLocation, Outlet } from "react-router-dom";
import { useRole } from "./RoleContext";

import MainNavbar from "./MainNavbar";
import ActualCommit from "./ActualCommit";
import Chats from "./dashboard/Chats";
import Ai from "./Ai";
import "../styles.css";

const Layout = () => {
  const location = useLocation();
  const { role } = useRole();

  const [showModal, setShowModal] = useState(false);

  // Paths where layout should hide main UI (like login)
  const hiddenPaths = ["/"];
  const shouldHideMainUI = hiddenPaths.includes(location.pathname);

  const isProfilePage = location.pathname.startsWith("/profile");

  // Only show main UI when role exists and not on hidden paths
  // const showUI = role && !shouldHideMainUI;temporary
const showUI = location.pathname !== "/";
  return (
    <>
      <div className={`layout-container ${showModal ? "blurred" : ""}`}>
        {/* ✅ Main Navbar */}
        {/* {showUI && <MainNavbar />} */}

        <div style={{ marginTop: "80px" }} />

        {/* ✅ Route outlet for pages */}
        <main>
          <Outlet />
        </main>

        {/* ✅ Role-based components */}
        {/* {showUI && role !== "bh" && role !== "sbuh" && <ActualCommit />} temporary*/}
        {/* {showUI && <ActualCommit />} */}
        {/* {showUI && isProfilePage && <Chats />} temporary*/}
      </div>

      {/* ✅ Floating AI Assistant (for SBUs only) */}
      {/* {showUI && role === "sbuh" && <Ai />} temporary */}
    </>
  );
};

export default Layout;

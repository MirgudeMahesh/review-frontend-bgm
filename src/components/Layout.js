import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Subnavbar from './Subnavbar';
import { useRole } from './RoleContext';
import ActualCommit from './ActualCommit';
import Filtering from './Filtering';
import '../styles.css';
import { faComment } from "@fortawesome/free-solid-svg-icons";
import Escalating from './Escalating';
import Chats from './dashboard/Chats';
import MainNavbar from './MainNavbar';
import Textarea from './Textarea';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from '@fortawesome/free-solid-svg-icons';
import Ai from './Ai';
const Layout = ({ children }) => {
  
  const navigate = useNavigate();
  const location = useLocation();
  const { role, name,userRole } = useRole();

  const hideComponentsOnPaths = ['/'];
  const shouldHideMainUI = hideComponentsOnPaths.includes(location.pathname);
  const isProfilePage = location.pathname.startsWith("/profile");

  // Modal State
   const [inputText, setInputText] = useState('');
  const [showModal, setShowModal] = useState(false);

 


  return (
    <>
      {/* Optional: Add blur class to main UI when modal shows */}
      <div className={`layout-container ${showModal ? 'blurred' : ''}`}>
        {role && !shouldHideMainUI && <MainNavbar  />}
        <div style={{ marginTop: "150px" }}>
{/* {role && !shouldHideMainUI && role !== "bh" && role !== "sbuh"  && (
  <Navbar handleOpenModal={handleOpenModal} />
)} */}

        </div>
        

        <main>{children}</main>

{role && role !== "bh" && role !== "sbuh" && !shouldHideMainUI && <ActualCommit />}

{isProfilePage && !shouldHideMainUI && <Chats />}

       
      </div>

 {role==='sbuh' && !shouldHideMainUI && <Ai/>}





    </>
  );
};

export default Layout;
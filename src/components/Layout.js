import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Subnavbar from './Subnavbar';
import { useRole } from './RoleContext';
import ActualCommit from './ActualCommit';
import Filtering from './Filtering';
import '../styles.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment } from "@fortawesome/free-solid-svg-icons";
import Escalating from './Escalating';
import Chats from './dashboard/Chats';
import MainNavbar from './MainNavbar';
import Textarea from './Textarea';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { role, name,userRole } = useRole();

  const hideComponentsOnPaths = ['/'];
  const shouldHideMainUI = hideComponentsOnPaths.includes(location.pathname);
  const isProfilePage = location.pathname.startsWith("/profile");

  // Modal State
  const [showModal, setShowModal] = useState(false);

  const [inputText, setInputText] = useState('');

  const handleOpenModal = () => setShowModal(true); 
  const handleCloseModal = () => setShowModal(false); 
  const handleSubmit = () => {
    alert(`Submitted: ${inputText}`);
    setShowModal(false);
  };

  return (
    <>
      {/* Optional: Add blur class to main UI when modal shows */}
      <div className={`layout-container ${showModal ? 'blurred' : ''}`}>
        {role && !shouldHideMainUI && <MainNavbar />}
        <div style={{ marginTop: "150px" }}>
{role && !shouldHideMainUI && role !== "bh" && role !== "sbuh"  && (
  <Navbar handleOpenModal={handleOpenModal} />
)}

        </div>

        <main>{children}</main>

{role && role !== "bh" && role !== "sbuh" && !shouldHideMainUI && <ActualCommit />}

{isProfilePage && !shouldHideMainUI && <Chats />}

       
      </div>


    {showModal && (
<div className="modal-overlay">
  <div className="modal-box">
    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
      <button
        onClick={handleCloseModal}
        style={{
          border: 'none',
          background: 'transparent',
          fontSize: '24px',
          cursor: 'pointer',
        }}
      >
        &times;
      </button>
    </div>
    <Escalating />
  </div>
</div>

)}





    </>
  );
};

export default Layout;
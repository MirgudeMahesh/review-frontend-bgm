import React,{useState}from 'react'
import { useLocation } from 'react-router-dom';
import Escalating from './Escalating';
import { useNavigate } from "react-router-dom";

import { useRole } from './RoleContext';
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NProgress from 'nprogress';
import 'nprogress/nprogress.css'; // import styles
import useEncodedTerritory from './hooks/useEncodedTerritory';
export default function Navbar() {
const{encoded}=useEncodedTerritory();
const location = useLocation();
  const { role, setRole, setName, setUserRole, setUser } = useRole();
 const isSelectionPage = 
  location.pathname.startsWith("/Selection") || 
  location.pathname.startsWith("/profile");

    // includes ?ec=....
  const navigate = useNavigate();
  const Raise = () => {
  
    navigate(`/disclosure?ec=${encoded}`);
   
     
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  const Review = () => {
    
    navigate(`/FinalReport?ec=${encoded}`);
      
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const Info = () => {
   
    navigate(`/info?ec=${encoded}`);
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const selection = () => {
    

    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate(`/Selection?ec=${encoded}`);
      

  }
  const notselection = () => {
   
setRole('');
    setName('');
    setUser('');
    setUserRole('');
   
  
    
     
     

    navigate('/', { replace: true });
     
  }
    const [showModal, setShowModal] = useState(false);
  
  
    const handleOpenModal = () => setShowModal(true); 
    const handleCloseModal = () => setShowModal(false); 
  const handleSelect = (value) => {
    switch (value) {
      case 'report':
        Review();
        break;
      case 'performance':
        Raise();
        break;
      case 'MyChats':
        Info();
        break;
      case 'chose':
        selection();
        break;
      case 'notchose':
        notselection();
        break;
      default:
        break;
    }
  };



  return (
    <div>

      <nav className="navbar">
        <h2 >Review</h2>
         {/* <select className="scb" id="options" onChange={(e) => handleSelect(e.target.value)}>
          <option value="">Select</option>
          <option value="report">Profile</option> */}
          {/* {(role === 'sbuh' || role === 'admin ') && (<option value="performance">Raise</option>)} */}
          {/* <option value="MyChats">Info</option> */}
          {/* {role !== 'be' && <option value="hygine">Hygine</option>} */}


          {/* <option value="notchose">
            logout 
          </option> */}

        {/* </select>  */}






       
         <ul className="navbar-menu">

      {/* ⭐ ONLY show Select when URL contains /Selection */}
      {isSelectionPage ? (
        <li className="hide">
          <button id="contact" className="text-button" onClick={selection}>
            select
          </button>
        </li>
      ) : (
        <>
          {/* ⭐ These buttons will show only when NOT on /Selection */}
          <li className="hide">
            <button className="text-button" onClick={Review}>Profile</button>
          </li>

          <li className="hide">
            <button id="contact" className="text-button" onClick={Info}>
              Info
            </button>
          </li>

          {/* <li className="hide">
            <button id="contact" className="text-button" onClick={notselection}>
              logout
            </button>
          </li> */}
        </>
      )}

    </ul>
      </nav>
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

    </div>
  )
}






//temporary

{/* <div>

      <nav className="navbar">
        <h2 >Review</h2>
        <select className="scb" id="options" onChange={(e) => handleSelect(e.target.value)}>
          <option value="">Select</option>
          <option value="report">Profile</option>
          {(role === 'sbuh' || role === 'admin ') && (<option value="performance">Raise</option>)}
          <option value="MyChats">Info</option>


          <option value={role === 'be' ? "notchose" : "chose"}>
            {role === 'be' ? "logout" : "chose"}
          </option>

        </select>






        <ul className="navbar-menu">

          {(role !== 'sbuh' || role !== 'bh') && (<li className="hide">
            <button className="text-button" onClick={Review}>Profile</button>
          </li>)

          }


         




       




          {role !== "bh" && role !== "sbuh" && (
            <li className="hide">
              <a>
                <button id="contact" className="text-button" onClick={Info}>
                  Info
                </button>
              </a>
            </li>
          )}

          <li className="hide">
            <a>
              {role === 'be' ? (<button id="contact" className="text-button" onClick={notselection}>
                logout
              </button>) : (<button id="contact" className="text-button" onClick={selection}>select</button>)}

            </a>
          </li>
           {(role === 'sbuh' || role === 'admin ') && (<li className="hide">
            <button className="text-button" onClick={Raise}  >Raise</button>
          </li>)}

          <li>
            <button
              onClick={handleOpenModal}
              style={{
                border: 'none',
                background: 'transparent',
                color: 'white',
                fontWeight: '500',
                cursor: 'pointer',
                fontSize: '18px',
              }}
            >
              <FontAwesomeIcon icon={faTriangleExclamation} />
            </button>
          </li>
        </ul>
      </nav>
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

    </div> */}
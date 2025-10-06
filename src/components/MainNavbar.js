import React,{useState}from 'react'
import Escalating from './Escalating';
import { useNavigate } from "react-router-dom";

import { useRole } from './RoleContext';
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NProgress from 'nprogress';
import 'nprogress/nprogress.css'; // import styles
export default function Navbar() {

  const ec = localStorage.getItem("empByteCode");
  const { role, setRole, setName, setUserRole, setUser } = useRole();

  const navigate = useNavigate();
  const Raise = () => {
    NProgress.start();
    navigate(`/disclosure?ec=${ec}`);
      NProgress.done();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  const Review = () => {
    NProgress.start();
    navigate(`/FinalReport?ec=${ec}`);
      NProgress.done();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const Info = () => {
    NProgress.start();
    navigate(`/info?ec=${ec}`);
      NProgress.done();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const selection = () => {
    NProgress.start();


    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate(`/Selection?ec=${ec}`);
      NProgress.done();

  }
  const notselection = () => {
    NProgress.start();

    setRole('');
    setName('');
    setUser('');

    localStorage.removeItem('empterr');
    localStorage.removeItem('empcde');
    localStorage.removeItem('empByteCode');
    localStorage.removeItem('territory');

    navigate('/', { replace: true });
      NProgress.done();
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
        <select className="scb" id="options" onChange={(e) => handleSelect(e.target.value)}>
          <option value="">Select</option>
          <option value="report">Profile</option>
          {(role === 'sbuh' || role === 'admin ') && (<option value="performance">Raise</option>)}
          <option value="MyChats">Info</option>
          {/* {role !== 'be' && <option value="hygine">Hygine</option>} */}


          <option value={role === 'be' ? "notchose" : "chose"}>
            {role === 'be' ? "logout" : "chose"}
          </option>

        </select>






        <ul className="navbar-menu">

          {(role !== 'sbuh' || role !== 'bh') && (<li className="hide">
            <button className="text-button" onClick={Review}>Profile</button>
          </li>)

          }


          {/* {(role === 'sbuh' || role === 'admin ') && (<li className="hide">
            <button className="text-button" onClick={Raise}  >Raise</button>
          </li>)} */}





          {/* {role !== 'be' && role !== 'bm' && (
            <li className="hide">
              <a>
                <button id="resume" className="text-button" onClick={commitment} >
                  Compliance
                </button>
              </a>
            </li>
          )} */}




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
          <li className="hide">
            <a>
              <button id="contact" className="text-button" onClick={Raise}  >Raise
              </button>
            </a>
          </li>
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

    </div>
  )
}

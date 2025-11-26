import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles.css';
import { useRole } from './RoleContext';
import Textarea from './Textarea';
import { useLocation } from 'react-router-dom';
import useEncodedTerritory from './hooks/useEncodedTerritory';
import useProfileTerritory from "./hooks/useProfileTerritory";
export default function SubNavbar() {
  const navigate = useNavigate();
  const { userRole, name } = useRole();
  const [showModal1, setShowModal1] = useState(false);

  const handleOpenModal1 = () => setShowModal1(true);
  const handleCloseModal1 = () => setShowModal1(false);
const [selectedMenu, setSelectedMenu] = useState("");

      const {encoded,decoded}= useEncodedTerritory();
     const { profileTerritory , profileEncodedTerritory } = useProfileTerritory();       
   
  const handleSelect = (value) => {
     setSelectedMenu(value); 
    switch (value) {
      case 'performance':
         
navigate(`/profile/${name}/Performance?ec=${encoded}&pec=${profileEncodedTerritory}`);
        
        break;
      case 'Review':
        navigate(`/profile/${name}/Review?ec=${encoded}&pec=${profileEncodedTerritory}`);
        break;
      case 'Miscelaneous':
        navigate(`/profile/${name}/TeamBuild?ec=${encoded}&pec=${profileEncodedTerritory}`);
        break;
      case 'hygine':
        navigate(`/profile/${name}/Hygine?ec=${encoded}&pec=${profileEncodedTerritory}`);
        break;
      case 'compliance':
        navigate(`/profile/${name}/Compliance?ec=${encoded}&pec=${profileEncodedTerritory}`);
        break;
      case 'Escalating':
        handleOpenModal1();
        break;
      default:
        break;
    }
  };

  return (
    <div>
      <div className='select-wrapper'>
        <select className="scb2" id="options" value={selectedMenu} onChange={(e) => handleSelect(e.target.value)}>
          <option value="">select</option>
          <option value="Review">Report</option>
          <option value="performance">Performance</option>
          <option value="Miscelaneous">
            {/* {userRole === "BE" || userRole==='TE' ||userRole === "BM" ? "Efforts" : "TeamBuild"} */}
            Efforts
          </option>
          {/* {userRole !== 'BE' && userRole!=='TE' && <option value="hygine">Hygiene</option>}
          {userRole !== 'BE' && userRole!=='TE' &&  userRole !== 'BM' && <option value="compliance">Compliance</option>}
          <option value="Chats">Todo</option> */}
          <option value="Escalating">Commit</option>
        </select>
      </div>

      <div className="tabs7">
                <li><Link to={`/Selection?ec=${encoded}`}>Home</Link></li>

        <li><Link to={`/profile/${name}/Review?ec=${encoded}&pec=${profileEncodedTerritory}`}>Report</Link></li>
        <li><Link to={`/profile/${name}/Performance?ec=${encoded}&pec=${profileEncodedTerritory}`}>Performance</Link></li>
        <li>
          <Link to={`/profile/${name}/TeamBuild?ec=${encoded}&pec=${profileEncodedTerritory}`}>
            {/* {userRole === "BE" || userRole==='TE' || userRole === "BM" ? "Efforts" : "TeamBuild"} */}
            Efforts
          </Link>
        </li>
        {/* {userRole !== 'BE' && userRole!=='TE' && <li><Link to={`/profile/${name}/Hygine?ec=${encoded}&pec=${profileEncodedTerritory}`}>Hygine</Link></li>} */}
        {/* {userRole !== 'BE' && userRole!=='TE' && userRole !== 'BM' && <li><Link to={`/profile/${name}/Compliance?ec=${encoded}&pec=${profileEncodedTerritory}`}>Compliance</Link></li>} */}
        {/* <li><b>Todo</b></li> */}
        <button
          onClick={handleOpenModal1}
          style={{
            border: 'none',
            background: 'transparent',
            fontWeight: '500',
            cursor: 'pointer',
            fontSize: '18px',
            color: 'black',
          }}
        >
          ?
        </button>
      </div>

      <p style={{textAlign:'center'}}>{name}</p>

      {/* Modal */}
      {showModal1 && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
            <button
  onClick={handleCloseModal1}
  style={{
    border: "none",
    background: "transparent",
    fontSize: "24px",
    cursor: "pointer",
    position: "absolute",
    top: "12px",
    right: "12px",
    zIndex: 2000000
  }}
>
  &times;
</button>

            </div>
            <Textarea />
          </div>
        </div>
      )}
    </div>
  );
}

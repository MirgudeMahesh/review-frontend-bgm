import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles.css';
import { useRole } from './RoleContext';
import Textarea from './Textarea';
import useEncodedTerritory from './hooks/useEncodedTerritory';
import useProfileTerritory from "./hooks/useProfileTerritory";

export default function SubNavbar() {
  const navigate = useNavigate();
  const { userRole, name } = useRole();
  const [showModal1, setShowModal1] = useState(false);

  const handleOpenModal1 = () => setShowModal1(true);
  const handleCloseModal1 = () => setShowModal1(false);

  const [selectedMenu, setSelectedMenu] = useState("");

  const { encoded } = useEncodedTerritory();
  const { profileEncodedTerritory } = useProfileTerritory();

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
          <option value="Miscelaneous">Efforts</option>
          <option value="Escalating">Commit</option>
        </select>
      </div>

      <div className="tabs7">
        <li><Link to={`/Selection?ec=${encoded}`}>Home</Link></li>
        <li><Link to={`/profile/${name}/Review?ec=${encoded}&pec=${profileEncodedTerritory}`}>Report</Link></li>
        <li><Link to={`/profile/${name}/Performance?ec=${encoded}&pec=${profileEncodedTerritory}`}>Performance</Link></li>
        <li><Link to={`/profile/${name}/TeamBuild?ec=${encoded}&pec=${profileEncodedTerritory}`}>Efforts</Link></li>

        {/* Help button */}
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

      <p style={{ textAlign: 'center' }}>{name}</p>

      {/* Modal */}
      {showModal1 && (
        <div className="modal-overlay">
          <div className="modal-box" style={{ position: "relative" }}>

            {/* ⭐ NEW BEAUTIFUL CLOSE BUTTON ⭐ */}
            <button
              onClick={handleCloseModal1}
              style={{
  position: "absolute",
  top: "10px",
  right: "10px",
  width: "20px",
  height: "20px",
  borderRadius: "50%",
  border: "none",
  background: "#575454ff",
  color: "white",
  fontSize: "14px",
  fontWeight: "bold",
  cursor: "pointer",
  boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 999999
}}

            >
              ✕
            </button>

            <Textarea />
          </div>
        </div>
      )}
    </div>
  );
}

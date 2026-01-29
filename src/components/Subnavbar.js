import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles.css';
import { useRole } from './RoleContext';
import Textarea from './Textarea';
import useEncodedTerritory from './hooks/useEncodedTerritory';
import useProfileTerritory from "./hooks/useProfileTerritory";

export default function SubNavbar() {
  
  const navigate = useNavigate();
  const { userRole, name, user } = useRole();

  const [showModal1, setShowModal1] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState("");

  const { encoded } = useEncodedTerritory();
  const { profileEncodedTerritory } = useProfileTerritory();

  const handleOpenModal1 = () => setShowModal1(true);
  const handleCloseModal1 = () => setShowModal1(false);

  const handleSelect = (value) => {
    setSelectedMenu(value);

    switch (value) {
      case 'Home':
        navigate(`/FinalReport?ec=${encoded}`);
        break;
      case 'performance':
        navigate(`/profile/${name}/Performance?ec=${encoded}&pec=${profileEncodedTerritory}`);
        break;
      case 'Review':
        navigate(`/profile/${name}/Review?ec=${encoded}&pec=${profileEncodedTerritory}`);
        break;
      case 'Miscelaneous':
        navigate(`/profile/${name}/TeamBuild?ec=${encoded}&pec=${profileEncodedTerritory}`);
        break;
        case 'Hygiene':
        navigate(`/profile/${name}/Hygine?ec=${encoded}&pec=${profileEncodedTerritory}`);
        break;
        case 'Compliance':
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
    <div className="subnavbar-wrapper">
      {/* mobile select */}
      <div className="select-wrapper">
        <select
          className="scb2"
          id="options"
          value={selectedMenu}
          onChange={(e) => handleSelect(e.target.value)}
        >
          <option value="">Select</option>
          <option value="Home">Home</option>
          <option value="Review">Report</option>
          <option value="performance">Performance</option>
          <option value="Miscelaneous">Efforts</option>
          {userRole === 'BM'|| userRole === 'BL' && (<option value="Hygiene">Hygiene</option>)}
            {userRole === 'BL' && (<option value="Compliance">Compliance</option>)}
          <option value="Escalating">Commit</option>
        </select>
      </div>

      {/* desktop pills */}
      <ul className="subnav-tabs">
        <li>
          <Link to={`/FinalReport?ec=${encoded}`}>Home</Link>
        </li>
        <li>
          <Link to={`/profile/${name}/Review?ec=${encoded}&pec=${profileEncodedTerritory}`}>
            Report
          </Link>
        </li>
        <li>
          <Link to={`/profile/${name}/Performance?ec=${encoded}&pec=${profileEncodedTerritory}`}>
            Performance
          </Link>
        </li>
        <li>
          <Link to={`/profile/${name}/TeamBuild?ec=${encoded}&pec=${profileEncodedTerritory}`}>
            Efforts
          </Link>
        </li>
        {userRole === 'BM'|| userRole === 'BL' && (
          <li>
            <Link to={`/profile/${name}/Hygine?ec=${encoded}&pec=${profileEncodedTerritory}`}>
              Hygiene
            </Link>
          </li>
        )}
{userRole === 'BL' && (
          <li>
            <Link to={`/profile/${name}/Compliance?ec=${encoded}&pec=${profileEncodedTerritory}`}>
             Compliance
            </Link>
          </li>
        )}
        <li>
          <button
            type="button"
            className="subnav-commit-btn"
            onClick={handleOpenModal1}
          >
            Commit
          </button>
        </li>
      </ul>

      <p className="subnav-name">{user}</p>

      {/* Modal */}
      {showModal1 && (
        <div className="modal-overlay">
          <div className="modal-box">
            <button
              onClick={handleCloseModal1}
              className="modal-close-btn"
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

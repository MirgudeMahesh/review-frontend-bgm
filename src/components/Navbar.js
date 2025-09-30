import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRole } from './RoleContext';
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Navbar({ handleOpenModal }) {
  const { role } = useRole();
  const ec = localStorage.getItem("empByteCode");
  const navigate = useNavigate();

  // Navigation functions
  const perform = () => {
    navigate(`/TeamBuild?ec=${ec}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const Home = () => {
    navigate(`/Performance?ec=${ec}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const Review = () => {
    navigate(`/FinalReport?ec=${ec}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const misc = () => {
    navigate(`/Hygine?ec=${ec}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const commitment = () => {
    navigate(`/Compliance?ec=${ec}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Select dropdown handler
  const handleSelect = (value) => {
    switch (value) {
      case 'report':
        Review();
        break;
      case 'performance':
        Home();
        break;
      case 'team':
        perform();
        break;
      case 'hygine':
        misc();
        break;
      case 'compliance':
        commitment();
        break;
      case 'Escalating':
        handleOpenModal();
        break;
      default:
        break;
    }
  };

  return (
    <div>
      <div className="select-wrapper">
        <select
          className="scb1"
          id="options"
          onChange={(e) => handleSelect(e.target.value)}
        >
          <option value="">Select</option>
          <option value="report">Report</option>
          <option value="performance">Performance</option>
          <option value="team">TeamBuild</option>
          {role !== 'be' && <option value="hygine">Hygine</option>}
          {role !== 'be' && role !== 'bm' && (
            <option value="compliance">Compliance</option>
          )}
          <option value="Escalating">Escalating</option>
        </select>
      </div>

      <ul className="tabs77">
        <li>
          <button className="text-button3" onClick={Review}>Report</button>
        </li>

        <li>
          <button className="text-button3" onClick={Home}>Performance</button>
        </li>

        <li>
          <button className="text-button3" onClick={perform}>
            {role === "be" || role === "bm" ? "Efforts" : "TeamBuild"}
          </button>
        </li>

        {role !== 'be' && (
          <li>
            <button className="text-button3" onClick={misc}>Hygiene</button>
          </li>
        )}

        {role !== 'be' && role !== 'bm' && (
          <li>
            <button className="text-button3" onClick={commitment}>Compliance</button>
          </li>
        )}

        {/* Escalation Button */}
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
    </div>
  );
}

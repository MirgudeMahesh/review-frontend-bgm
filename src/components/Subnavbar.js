import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles.css';
import { useRole } from './RoleContext';
import Textarea from './Textarea';

export default function SubNavbar() {
  const navigate = useNavigate();
  const { userRole, name } = useRole();
  const [showModal1, setShowModal1] = useState(false);

  const handleOpenModal1 = () => setShowModal1(true);
  const handleCloseModal1 = () => setShowModal1(false);

  const handleSelect = (value) => {
    switch (value) {
      case 'performance':
   
        navigate(`/profile/${name}/Performance`);
        break;
      case 'Review':
        navigate(`/profile/${name}/Review`);
        break;
      case 'Miscelaneous':
        navigate(`/profile/${name}/TeamBuild`);
        break;
      case 'hygine':
        navigate(`/profile/${name}/Hygine`);
        break;
      case 'compliance':
        navigate(`/profile/${name}/Compliance`);
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
        <select className="scb2" id="options" onChange={(e) => handleSelect(e.target.value)}>
          <option value="Review">Report</option>
          <option value="performance">Performance</option>
          <option value="Miscelaneous">
            {userRole === "BE" || userRole==='TE' ||userRole === "BM" ? "Efforts" : "TeamBuild"}
          </option>
          {userRole !== 'BE' && userRole!=='TE' && <option value="hygine">Hygine</option>}
          {userRole !== 'BE' && userRole!=='TE' &&  userRole !== 'BM' && <option value="compliance">Compliance</option>}
          <option value="Chats">Todo</option>
          <option value="Escalating">Commit</option>
        </select>
      </div>

      <div className="tabs7">
        <li><Link to={`/profile/${name}/Review`}>Report</Link></li>
        <li><Link to={`/profile/${name}/Performance`}>Performance</Link></li>
        <li>
          <Link to={`/profile/${name}/TeamBuild`}>
            {userRole === "BE" || userRole==='TE' || userRole === "BM" ? "Efforts" : "TeamBuild"}
          </Link>
        </li>
        {userRole !== 'BE' && userRole!=='TE' && <li><Link to={`/profile/${name}/Hygine`}>Hygine</Link></li>}
        {userRole !== 'BE' && userRole!=='TE' && userRole !== 'BM' && <li><Link to={`/profile/${name}/Compliance`}>Compliance</Link></li>}
        <li><Link>Todo</Link></li>
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
                  border: 'none',
                  background: 'transparent',
                  fontSize: '24px',
                  cursor: 'pointer',
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



import React, { useState,useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useRole } from './RoleContext';
import DrillDownHierarchy from './DrillDownHierarchy';
import MainNavbar from './MainNavbar';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css'; 
function Selection() {
  const [expandedRows, setExpandedRows] = useState({});
  const navigate = useNavigate();
  const { setRole, setName ,setUser,setUserRole} = useRole();


    const logout = () => {
    
    setRole('');
    setName('');
    setUser('');
    setUserRole('');
   
  
    localStorage.removeItem('empcde');
     
     

    localStorage.removeItem('selectedTerritory');
    navigate('/', { replace: true });
      };
  return (
    <div>
      {/* <MainNavbar/> */}
      <DrillDownHierarchy />

      

<div 
  style={{
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    padding: '10px',
    flexDirection: 'column',
    textAlign: 'center',
    fontSize: '14px',
    color: '#444'
  }}
>
  <p>🔹 <b>Click on any information</b> to expand the hierarchy.</p>
  <p>🔹 <b>Click on a BE’s name</b> (after drill-down) to view their dashboard.</p>
    <p>⚠️ <b>Raise a ticket on iMACX</b> if you find any data inaccuracy</p>

</div>
    </div>
  );
}

export default Selection;

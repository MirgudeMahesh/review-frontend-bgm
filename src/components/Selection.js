

import React, { useState,useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useRole } from './RoleContext';
import DrillDownHierarchy from './DrillDownHierarchy';
import MainNavbar from './MainNavbar';
function Selection() {
  const [expandedRows, setExpandedRows] = useState({});
  const navigate = useNavigate();
  const { setRole, setName ,setUser,setUserRole} = useRole();


    const logout = () => {
    setRole('');
    setName('');
    setUser('');
    setUserRole('');
   
    localStorage.removeItem('empterr');   
    localStorage.removeItem('empcde');
     localStorage.removeItem('territory');
     localStorage.removeItem('empByteCode');

    localStorage.removeItem('selectedTerritory');
    navigate('/', { replace: true });
  };
  return (
    <div>
      <MainNavbar/>
      <DrillDownHierarchy />

      

     <div style={{justifyContent:'center',alignItems:'center',display:'flex',padding:'10px'}}> <button  onClick={logout}>Logout</button></div>
    </div>
  );
}

export default Selection;

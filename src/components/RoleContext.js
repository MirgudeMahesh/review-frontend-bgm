import React, { createContext, useContext, useState, useEffect } from 'react';

const RoleContext = createContext();

export const RoleProvider = ({ children }) => {
  const [role, setRole] = useState(localStorage.getItem('role') || '');
  const [name, setName] = useState(localStorage.getItem('name') || '');
  const [user, setUser] = useState(localStorage.getItem('user') || '');
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole') || '');
  const [division, setDivision] = useState(localStorage.getItem('division') || '');

  useEffect(() => {
    if (role) localStorage.setItem('role', role);
    else localStorage.removeItem('role');
  }, [role]);

  useEffect(() => {
    if (division) localStorage.setItem('division', division);
    else localStorage.removeItem('division');
  }, [division]);

 
 useEffect(() => {
    if (userRole) localStorage.setItem('userRole', userRole);
    else localStorage.removeItem('userRole');
  }, [userRole]);

  useEffect(() => {
    if (name) localStorage.setItem('name', name);
    else localStorage.removeItem('name');
  }, [name]);

    useEffect(() => {
    if (user) localStorage.setItem('user', user);
    else localStorage.removeItem('user');
  }, [user]);

  return (
    <RoleContext.Provider value={{ role, setRole, name, setName,user, setUser ,userRole, setUserRole ,division,setDivision}}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => useContext(RoleContext);

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRole } from './RoleContext';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css'; // import styles
export default function Loginpage() {
  const [warning, setWarning] = useState('');
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmp, setSelectedEmp] = useState(null);

  const navigate = useNavigate();
  const { setRole, setUser } = useRole();

  // Fetch employees once on mount
  useEffect(() => {
    NProgress.start();
    fetch('https://review-backend-bgm.onrender.com/employees')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch employees');
        return res.json();
      })
      .then((data) => {
        setEmployees(data);
        setFilteredEmployees(data);
      })
      .catch((err) => {
        console.error('Error fetching employees:', err);
        setWarning('Unable to load employees. Please try again later.');
      }).finally(() => { NProgress.done(); });
  }, []);

  // Filter employees whenever searchTerm changes
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredEmployees(employees);
    } else {
      const filtered = employees.filter(
        (emp) =>
          emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.Territory.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredEmployees(filtered);
    }
  }, [searchTerm, employees]);

  const handleLogin = () => {
    if (!selectedEmp) {
      setWarning("Please select an employee");
      return;
    }

    if (!selectedEmp.Role) {
      setWarning("Role not found for selected employee");
      return;
    }
      // Start top loading bar
    
//temporary
// const role = selectedEmp.Role.toLowerCase();
   

// const userRole =
//   role === "be" || role === "te" || role === "kae" || role === "ne"
//     ? "be"
//     : role;


  
  
    

//     setRole(userRole);
    setUser(selectedEmp.name);

    // Encode empCode in Base64 for URL
    const encoded = btoa(selectedEmp.Territory);
  
    navigate(`/FinalReport?ec=${encoded}`, { replace: true });
     };

  return (
    <div
      style={{
        width: '300px',
        margin: '50px auto',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '8px',
      }}
    >
      <label>Search Employee:</label>
      <input
        type="text"
        placeholder="Type name or territory..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          width: '100%',
          padding: '8px',
          marginBottom: '10px',
          border: '1px solid #ccc',
          borderRadius: '4px',
        }}
      />

      <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
        {filteredEmployees.length > 0 ? (
          filteredEmployees.map((emp) => (
            <div
              key={emp.Territory}
              onClick={() => setSelectedEmp(emp)}
              style={{
                padding: '6px',
                borderBottom: '1px solid #eee',
                cursor: 'pointer',
                background:
                  selectedEmp?.Territory === emp.Territory ? '#d0e8ff' : 'transparent',
              }}
            >
              {emp.name} {emp.Territory}
            </div>
          ))
        ) : (
          <div style={{ color: 'gray' }}>Loading...</div>
        )}
      </div>

      <button
        onClick={handleLogin}
        style={{
          marginTop: '10px',
          padding: '8px',
          width: '100%',
          background: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
        }}
      >
        Login
      </button>

      {warning && <p style={{ color: 'red' }}>{warning}</p>}
    </div>
  );
}

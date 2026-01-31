import React, { useEffect, useState } from 'react';
import { useRole } from './RoleContext';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from 'react-router-dom';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import useEncodedTerritory from './hooks/useEncodedTerritory';

export default function FinalReport() {
  const { setRole, setName } = useRole();
  const navigate = useNavigate();
  const { decoded, encoded } = useEncodedTerritory();

  // Core score states
  const [score1, setScore1] = useState(null); // YTD Efforts/Business
  const [score2, setScore2] = useState(null); // YTD Business
  const [score3, setScore3] = useState(null); // Month Efforts
  const [score4, setScore4] = useState(null); // Month Business
  
  // Additional metrics
  const [hygieneMonth, setHygieneMonth] = useState(null);
  const [hygieneYTD, setHygieneYTD] = useState(null);
  const [commitmentMonth, setCommitmentMonth] = useState(null);
  const [commitmentYTD, setCommitmentYTD] = useState(null);
  const [effortMonth, setEffortMonth] = useState(null);
  const [effortYTD, setEffortYTD] = useState(null);
  
  // BH/SBUH Division states
  const [divisions, setDivisions] = useState([]);
  const [selectedDivision, setSelectedDivision] = useState('');
  const [isLoadingDivisions, setIsLoadingDivisions] = useState(false);
  
  // Role & User info
  const [roleAllowed, setRoleAllowed] = useState(null);
  const [showTerritory, setShowTerritory] = useState('');
  const [myName, setMyName] = useState('');

  const gotoselection = () => navigate(`/Selection?ec=${encoded}`);
  const perform = () => navigate(`/TeamBuild?ec=${encoded}`);
  const Home = () => navigate(`/Performance?ec=${encoded}`);
  const misc = () => navigate(`/Hygine?ec=${encoded}`);
  const commitment = () => navigate(`/Compliance?ec=${encoded}`);
  const bulkUpload = () => navigate(`/Disclosure?ec=${encoded}`);

  // Fetch divisions for BH/SBUH
  const fetchDivisions = async () => {
    if (!['BH', 'SBUH'].includes(roleAllowed) || !decoded) return;

    try {
      setIsLoadingDivisions(true);
      const res = await fetch("https://review-backend-bgm.onrender.com/getDivisions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Territory: decoded }),
      });

      const data = await res.json();
      if (res.ok && data.divisions) {
        setDivisions(data.divisions);
        if (data.divisions.length > 0 && !selectedDivision) {
          setSelectedDivision(data.divisions[0]);
        }
      }
    } catch (error) {
      console.error("Error fetching divisions:", error);
    } finally {
      setIsLoadingDivisions(false);
    }
  };

  // Handle division change - refetch data
  const handleDivisionChange = async (division) => {
    setSelectedDivision(division);
    // Reset scores while loading
    setScore1(null); setScore2(null); setScore3(null); setScore4(null);
    setHygieneMonth(null); setHygieneYTD(null); setCommitmentMonth(null); 
    setCommitmentYTD(null); setEffortMonth(null); setEffortYTD(null);
  };

  // Main data fetching effect
  useEffect(() => {
    if (!decoded) return;

    const verifyRoleAndFetchData = async () => {
      try {
        NProgress.start();

        // 1. Verify role
        const res = await fetch(`https://review-backend-bgm.onrender.com/checkrole?territory=${decoded}`);
        const data = await res.json();

        setShowTerritory(decoded);
        setMyName(data.name);
        setName(data.name);

        const normalizedRole = ['BE', 'TE', 'KAE', 'NE'].includes(data.role) ? 'BE' : data.role;
        setRoleAllowed(normalizedRole);
        setRole(normalizedRole);

        // Skip dashboard data for non-eligible roles
        if (!['BE', 'BM', 'BL', 'BH', 'SBUH'].includes(normalizedRole)) {
          return;
        }

        // 2. Fetch divisions for BH/SBUH
        if (['BH', 'SBUH'].includes(normalizedRole)) {
          await fetchDivisions();
        }

        // 3. Fetch dashboard data based on role
        if (normalizedRole === 'BE') {
          // BE: YTD + FTD data
          const [ytdRes, ftdRes] = await Promise.all([
            fetch("https://review-backend-bgm.onrender.com/dashboardYTD", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ Territory: decoded })
            }),
            fetch("https://review-backend-bgm.onrender.com/dashboardFTD", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ Territory: decoded })
            })
          ]);

          const ytdData = await ytdRes.json();
          const ftdData = await ftdRes.json();

          if (ytdRes.ok) {
            setScore1(Number(ytdData.totalScore1) || 0);
            setScore2(Number(ytdData.totalScore2) || 0);
          }
          if (ftdRes.ok) {
            setScore3(Number(ftdData.totalScore3) || 0);
            setScore4(Number(ftdData.totalScore4) || 0);
          }
        } 
        else if (normalizedRole === 'BM') {
          // BM: Efficiency data (no division)
          const bmRes = await fetch("https://review-backend-bgm.onrender.com/bmEfficiency", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ Territory: decoded })
          });
          const bmData = await bmRes.json();

          if (bmRes.ok) {
            setScore1(Number(bmData.effortYTD) || 0);
            setScore2(Number(bmData.businessYTD) || 0);
            setScore3(Number(bmData.effortMonth) || 0);
            setScore4(Number(bmData.businessMonth) || 0);
            setHygieneMonth(Number(bmData.hygieneMonth) || 0);
            setHygieneYTD(Number(bmData.hygieneYTD) || 0);
          }
        } 
        else if (['BL'].includes(normalizedRole)) {
          // BL: Efficiency data (no division)
          const blRes = await fetch("https://review-backend-bgm.onrender.com/blEfficiency", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ Territory: decoded })
          });
          const blData = await blRes.json();

          if (blRes.ok) {
            setScore1(Number(blData.effortYTD) || 0);
            setScore2(Number(blData.businessYTD) || 0);
            setScore3(Number(blData.effortMonth) || 0);
            setScore4(Number(blData.businessMonth) || 0);
            setHygieneMonth(Number(blData.hygieneMonth) || 0);
            setHygieneYTD(Number(blData.hygieneYTD) || 0);
            setCommitmentMonth(Number(blData.commitmentMonth) || 0);
            setCommitmentYTD(Number(blData.commitmentYTD) || 0);
            setEffortMonth(Number(blData.effortMonth) || 0);
            setEffortYTD(Number(blData.effortYTD) || 0);
          }
        } 
        else if (['BH', 'SBUH'].includes(normalizedRole) && selectedDivision) {
          // BH/SBUH: Efficiency data WITH Division
          const endpoint = normalizedRole === 'BH' ? 'bhEfficiency' : 'sbuhEfficiency';
          const res = await fetch(`https://review-backend-bgm.onrender.com/${endpoint}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              Territory: decoded, 
              Division: selectedDivision 
            })
          });
          const data = await res.json();

          if (res.ok) {
            setScore1(Number(data.effortYTD) || 0);
            setScore2(Number(data.businessYTD) || 0);
            setScore3(Number(data.effortMonth) || 0);
            setScore4(Number(data.businessMonth) || 0);
            setHygieneMonth(Number(data.hygieneMonth) || 0);
            setHygieneYTD(Number(data.hygieneYTD) || 0);
            setCommitmentMonth(Number(data.commitmentMonth) || 0);
            setCommitmentYTD(Number(data.commitmentYTD) || 0);
            setEffortMonth(Number(data.effortMonth) || 0);
            setEffortYTD(Number(data.effortYTD) || 0);
          }
        }
      } catch (err) {
        console.error("API error:", err);
      } finally {
        NProgress.done();
      }
    };

    verifyRoleAndFetchData();
  }, [decoded, selectedDivision, setRole, setName, encoded, roleAllowed]);

  // Show message for non-eligible roles
  if (roleAllowed !== null && !['BE', 'BM', 'BL', 'BH', 'SBUH'].includes(roleAllowed)) {
    return (
      <div style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "70vh",
        textAlign: "center",
        padding: "20px"
      }}>
        <p style={{ fontSize: "20px", fontWeight: "600", marginBottom: "15px", color: "#333" }}>
          Your dashboards are yet to be updated
        </p>
        <p style={{ fontSize: "14px", color: "#666", marginBottom: "20px" }}>
          Your current role: <strong>{roleAllowed}</strong>
        </p>
        <button
          style={{
            padding: "12px 26px",
            backgroundColor: "#2c2d2e",
            color: "white",
            border: "none",
            borderRadius: "10px",
            fontSize: "18px",
            cursor: "pointer",
            boxShadow: "0px 4px 12px rgba(0,0,0,0.15)",
            transition: "0.2s ease",
          }}
          onMouseOver={e => (e.target.style.backgroundColor = "#1d1e1f")}
          onMouseOut={e => (e.target.style.backgroundColor = "#2c2d2e")}
          onClick={gotoselection}
        >
          Review Others
        </button>
      </div>
    );
  }

  // Loading states
  const isLoading = score1 === null || score2 === null || score3 === null || score4 === null;
  if (roleAllowed !== null && isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '70vh' 
      }}>
        <p style={{ fontSize: '18px', color: '#666' }}>
          {isLoadingDivisions ? 'Loading divisions...' : 'Loading dashboard data...'}
        </p>
      </div>
    );
  }

  // Division selector for BH/SBUH
  const renderDivisionSelector = () => {
    if (!['BH', 'SBUH'].includes(roleAllowed) || !divisions.length) return null;

    return (
      <div style={{
        backgroundColor: '#f8f9fa',
        padding: '15px 20px',
        borderRadius: '8px',
        
        textAlign: 'center'
      }}>
        <label style={{ fontWeight: '600', marginRight: '10px', color: '#2c3e50' }}>
          Select Division: 
        </label>
        <select
          value={selectedDivision}
          onChange={(e) => handleDivisionChange(e.target.value)}
          style={{
            padding: '8px 12px',
            border: '1px solid #ddd',
            borderRadius: '6px',
            fontSize: '14px',
            minWidth: '200px'
          }}
        >
          {divisions.map((division) => (
            <option key={division} value={division}>{division}</option>
          ))}
        </select>
      </div>
    );
  };

  return (
    <div className="dashboard-shell">
      {/* User Info Header */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px 0',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        margin: '0 0 20px 0'
      }}>
        <p style={{ fontSize: '20px', fontWeight: '600', color: '#2c3e50', margin: '5px 0' }}>
          {myName}
        </p>
        <p style={{ fontSize: '14px', color: '#718096', margin: '5px 0' }}>
          {showTerritory} | Role: {roleAllowed}
        </p>
      </div>

      {/* Division Selector */}
      {renderDivisionSelector()}

      {/* Main Dashboard */}
      <div className="table-box">
        {roleAllowed === 'BE' && (
          <div className="efficiency-container">
            <h3>Efficiency Index</h3>
            <div className="efficiency-table-container">
              <div className="efficiency-table-scroll">
                <table className="efficiency-table">
                  <thead>
                    <tr>
                      <th>Parameter</th>
                      <th>Objective(%)</th>
                      <th>Month(%)</th>
                      <th>YTD(%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="clickable-param" onClick={Home}>
                        Business Performance
                      </td>
                      <td>50</td>
                      <td>{score4?.toFixed(2) || 0}</td>
                      <td>{score2?.toFixed(2) || 0}</td>
                    </tr>
                    <tr>
                      <td className="clickable-param" onClick={perform}>
                        Efforts and Effectiveness
                      </td>
                      <td>50</td>
                      <td>{score3?.toFixed(2) || 0}</td>
                      <td>{score1?.toFixed(2) || 0}</td>
                    </tr>
                    <tr className="shade">
                      <td>Efficiency Index</td>
                      <td>100</td>
                      <td>{((score3 || 0) + (score4 || 0)).toFixed(2)}</td>
                      <td>{((score1 || 0) + (score2 || 0)).toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="efficiency-notes-box">
              <p>📌 <b>Click on Parameter</b> to go to related dashboard</p>
              <p>⚠ <b>Raise a ticket on iMACX</b> if you find any data inaccuracy</p>
            </div>
          </div>
        )}

        {(roleAllowed === 'BM' || roleAllowed === 'BL' || roleAllowed === 'BH' || roleAllowed === 'SBUH') && (
          <div className="efficiency-container">
            <h3>Efficiency Index</h3>
            <div className="efficiency-table-container">
              <div className="efficiency-table-scroll">
                <table className="efficiency-table">
                  <thead>
                    <tr>
                      <th>Parameter</th>
                      <th>Objective(%)</th>
                      <th>Month(%)</th>
                      <th>YTD(%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="clickable-param" onClick={Home}>
                        {roleAllowed === 'BE' ? 'Business Performance' : 
                         roleAllowed === 'BH' ? 'Business & Brand Performance' : 'Business Performance'}
                      </td>
                      <td>{roleAllowed === 'BE' ? '50' : roleAllowed === 'BM' ? '50' : '35'}</td>
                      <td>{score4?.toFixed(2) || 0}</td>
                      <td>{score2?.toFixed(2) || 0}</td>
                    </tr>
                    
                    {roleAllowed !== 'BE' && (
                      <>
                        <tr>
                          <td className="clickable-param" onClick={misc}>
                            {roleAllowed === 'BE' ? '' : 'Business Hygiene & Demand Quality'}
                          </td>
                          <td>20</td>
                          <td>{hygieneMonth?.toFixed(2) || 0}</td>
                          <td>{hygieneYTD?.toFixed(2) || 0}</td>
                        </tr>
                        
                        <tr>
                          <td className="clickable-param" onClick={perform}>
                            {roleAllowed === 'BL' ? 'Team Building (Efforts)' :
                             roleAllowed === 'BH' ? 'Team & Culture Building' : 'Team Building'}
                          </td>
                          <td>{roleAllowed === 'BE' ? '50' : '20'}</td>
                          <td>{effortMonth?.toFixed(2) || 0}</td>
                          <td>{effortYTD?.toFixed(2) || 0}</td>
                        </tr>
                        
                        <tr>
                          <td className="clickable-param" onClick={commitment}>
                            {roleAllowed === 'BH' ? 'Activity & Productivity' :
                             roleAllowed === 'BL' || roleAllowed === 'SBUH' ? 'Compliance & Reporting' : ''}
                          </td>
                          <td>25</td>
                          <td>{commitmentMonth?.toFixed(2) || 0}</td>
                          <td>{commitmentYTD?.toFixed(2) || 0}</td>
                        </tr>
                      </>
                    )}
                    
                    <tr className="shade">
                      <td>Efficiency Index</td>
                      <td>100</td>
                      <td>{(
                        (score4 || 0) + 
                        (hygieneMonth || 0) + 
                        (effortMonth || 0) + 
                        (commitmentMonth || 0)
                      ).toFixed(2)}</td>
                      <td>{(
                        (score2 || 0) + 
                        (hygieneYTD || 0) + 
                        (effortYTD || 0) + 
                        (commitmentYTD || 0)
                      ).toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="efficiency-notes-box">
              <p>📌 <b>Click on Parameter</b> to go to related dashboard</p>
              <p>⚠ <b>Raise a ticket on iMACX</b> if you find any data inaccuracy</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

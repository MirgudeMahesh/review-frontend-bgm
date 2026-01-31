import React, { useState, useEffect } from 'react';
import { useRole } from './RoleContext';
import { useNavigate } from "react-router-dom";
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesLeft } from '@fortawesome/free-solid-svg-icons';
import useEncodedTerritory from './hooks/useEncodedTerritory';

export default function Commitment() {
  const navigate = useNavigate();
  const { role } = useRole();
  const { decoded, encoded } = useEncodedTerritory();

  // BL data states
  const [blData, setBlData] = useState(null);
  const [blYtdData, setBlYtdData] = useState(null);
  
  // BH/SBUH data states
  const [bhBeData, setBhBeData] = useState(null);
  const [bhYtdData, setBhYtdData] = useState(null);
  
  // Division dropdown states for BH/SBUH
  const [divisions, setDivisions] = useState([]);
  const [selectedDivision, setSelectedDivision] = useState('');
  const [isLoadingDivisions, setIsLoadingDivisions] = useState(false);

  const fmt = (v) => Number(parseFloat(v || 0)).toFixed(2);

  const HomePage = () => {
    navigate(`/FinalReport?ec=${encoded}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const HeadingWithHome = ({ children }) => {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "10px"
        }}
      >
        <h3 style={{ margin: 0, textAlign: "center" }}>
          {children}
        </h3>
        <button
          style={{
            background: "none",
            border: "none",
            color: "black",
            fontSize: "16px",
            cursor: "pointer",
            padding: 0
          }}
          onClick={HomePage}
        >
          <FontAwesomeIcon icon={faAnglesLeft} size="1x" />
        </button>
      </div>
    );
  };

  // Fetch divisions for BH/SBUH roles
  const fetchDivisions = async () => {
    if (!['BH', 'SBUH'].includes(role) || !decoded) return;

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
        // Auto-select first division if available
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

  // Handle division change
  const handleDivisionChange = (division) => {
    setSelectedDivision(division);
    // Clear data while loading new division
    setBhBeData(null);
    setBhYtdData(null);
  };

  // ------------------------------------------------
  // Main Data Fetching Effect
  // ------------------------------------------------
  useEffect(() => {
    if (!decoded) return;

    const loadAll = async () => {
      try {
        NProgress.start();

        if (role === 'BL') {
          const [blRes, blYtdRes] = await Promise.all([
            fetch("https://review-backend-bgm.onrender.com/blDashboardData", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ Territory: decoded }),
            }),
            fetch("https://review-backend-bgm.onrender.com/blDashboardytdData", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ Territory: decoded }),
            }),
          ]);

          const blJson = await blRes.json();
          const blYtdJson = await blYtdRes.json();

          console.log("BL Commitment Data fetched:", blJson);
          console.log("BL Commitment YTD Data fetched:", blYtdJson);

          if (blRes.ok) setBlData(blJson);
          if (blYtdRes.ok) setBlYtdData(blYtdJson);
        }
        else if (role === 'BH' || role === 'SBUH') {
          // Fetch divisions first
          await fetchDivisions();
          
          // Fetch data only if division selected
          if (selectedDivision) {
            const endpointBase = role === 'BH' ? 'bh' : 'sbuh';
            const [bhBeRes, bhYtdRes] = await Promise.all([
              fetch(`https://review-backend-bgm.onrender.com/${endpointBase}DashboardData`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ Territory: decoded, Division: selectedDivision }),
              }),
              fetch(`https://review-backend-bgm.onrender.com/${endpointBase}DashboardytdData`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ Territory: decoded, Division: selectedDivision }),
              }),
            ]);

            const bhBeJson = await bhBeRes.json();
            const bhYtdJson = await bhYtdRes.json();

            console.log(`${role} Commitment BE Data fetched:`, bhBeJson);
            console.log(`${role} Commitment YTD Data fetched:`, bhYtdJson);

            if (bhBeRes.ok) setBhBeData(bhBeJson);
            if (bhYtdRes.ok) setBhYtdData(bhYtdJson);
          }
        }
      } catch (err) {
        console.error("API error:", err);
      } finally {
        NProgress.done();
      }
    };

    loadAll();
  }, [decoded, role, selectedDivision]);

  // ------------------------------------------------
  // TOTAL SCORES CALCULATIONS
  // ------------------------------------------------
  const totalFTMScore =
    (Number(blData?.Team_Coverage_Score) || 0) +
    (Number(blData?.Team_Compliance_Score) || 0) +
    (Number(blData?.BM_Priority_Drs_Coverage_Score) || 0) +
    (Number(blData?.TP_Adherence_Score) || 0) +
    (Number(blData?.Secondary_Variance_Score) || 0) +
    (Number(blData?.MSP_Compliance_Territories_Score) || 0) +
    (Number(blData?.MSR_Compliance_Territories_Score) || 0);

  const totalYTDScore =
    (Number(blYtdData?.Team_Coverage_Score) || 0) +
    (Number(blYtdData?.Team_Compliance_Score) || 0) +
    (Number(blYtdData?.BM_Priority_Drs_Coverage_Score) || 0) +
    (Number(blYtdData?.TP_Adherence_Score) || 0) +
    (Number(blYtdData?.Secondary_Variance_Score) || 0) +
    (Number(blYtdData?.MSP_Compliance_Territories_Score) || 0) +
    (Number(blYtdData?.MSR_Compliance_Territories_Score) || 0);

  const bhTotalFTMScore =
    (Number(bhBeData?.Calls_Score) || 0) +
    (Number(bhBeData?.Coverage_Score) || 0) +
    (Number(bhBeData?.Compliance_Score) || 0) +
    (Number(bhBeData?.Priority_Drs_Coverage_Score) || 0) +
    (Number(bhBeData?.Priority_RX_Drs_Score) || 0) +
    (Number(bhBeData?.BM_Priority_Drs_Coverage_Score) || 0);

  const bhTotalYTDScore =
    (Number(bhYtdData?.Calls_Score) || 0) +
    (Number(bhYtdData?.Team_Coverage_Score) || 0) +
    (Number(bhYtdData?.Team_Compliance_Score) || 0) +
    (Number(bhYtdData?.Corporate_Drs_Coverage_Score) || 0) +
    (Number(bhYtdData?.Corporate_Drs_Active_Prescribers_Score) || 0) +
    (Number(bhYtdData?.BM_Priority_Drs_Coverage_Score) || 0);

  // BH/SBUH Loading/Selection Screen
  if ((role === 'BH' || role === 'SBUH') && 
      (!divisions.length || isLoadingDivisions || (!selectedDivision && !bhBeData))) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '70vh',
        flexDirection: 'column',
        padding: '20px'
      }}>
        <p style={{ fontSize: '18px', color: '#666', marginBottom: '20px' }}>
          {isLoadingDivisions ? 'Loading divisions...' : 'Please select a division to view data'}
        </p>
        {divisions.length > 0 && (
          <select 
            value={selectedDivision} 
            onChange={(e) => handleDivisionChange(e.target.value)}
            style={{
              padding: '12px 20px',
              fontSize: '16px',
              borderRadius: '8px',
              border: '2px solid #007bff',
              minWidth: '250px',
              backgroundColor: 'white',
              fontWeight: '500'
            }}
          >
            <option value="">📋 Select Division</option>
            {divisions.map((division, index) => (
              <option key={index} value={division}>
                📍 {division}
              </option>
            ))}
          </select>
        )}
      </div>
    );
  }

  return (
    <div>
      {/* Division Selector for BH/SBUH */}
      {(role === 'BH' || role === 'SBUH') && divisions.length > 0 && (
        <div style={{
          padding: '20px',
          backgroundColor: '#f8f9fa',
          borderRadius: '12px',
         
          textAlign: 'center',
          border: '2px solid #e9ecef',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
        }}>
          <label style={{ 
            fontWeight: '600', 
            marginRight: '15px',
            fontSize: '16px',
            color: '#495057'
          }}>
            📍 Select Division: 
          </label>
          <select 
            value={selectedDivision} 
            onChange={(e) => handleDivisionChange(e.target.value)}
            style={{
              padding: '12px 20px',
              fontSize: '16px',
              borderRadius: '8px',
              border: '2px solid #007bff',
              minWidth: '250px',
              backgroundColor: 'white',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            <option value="">Select Division</option>
            {divisions.map((division, index) => (
              <option key={index} value={division}>
                {division}
              </option>
            ))}
          </select>
          {selectedDivision && (
            <div style={{ 
              marginTop: '10px', 
              color: '#28a745', 
              fontSize: '14px',
              fontWeight: '500'
            }}>
              ✅ Selected: <strong>{selectedDivision}</strong>
            </div>
          )}
        </div>
      )}

      <div className='table-box'>
        {/* ==================== BL TABLE ==================== */}
        {role === "BL" && blData && blYtdData && (
          <div className="table-container">
            <div className="efficiency-container">
              <HeadingWithHome>
                Compliance & Reporting
              </HeadingWithHome>
              <div className="efficiency-table-container">
                <div className="efficiency-table-scroll">
                  <table className="efficiency-table">
                    <thead>
                      <tr>
                        <th>Weightage</th>
                        <th>Description</th>
                        <th>Objective</th>
                        <th>Month</th>
                        <th>Month Score</th>
                        <th>YTD</th>
                        <th>YTD Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>3%</td>
                        <td>Team's Customer Coverage</td>
                        <td>95%</td>
                        <td>{blData?.Team_Coverage}</td>
                        <td>{blData?.Team_Coverage_Score}</td>
                        <td>{blYtdData?.Team_Coverage}</td>
                        <td>{blYtdData?.Team_Coverage_Score}</td>
                      </tr>
                      <tr>
                        <td>3%</td>
                        <td>Team's Customer Compliance</td>
                        <td>90%</td>
                        <td>{blData?.Team_Compliance}</td>
                        <td>{blData?.Team_Compliance_Score}</td>
                        <td>{blYtdData?.Team_Compliance}</td>
                        <td>{blYtdData?.Team_Compliance_Score}</td>
                      </tr>
                      <tr>
                        <td>4%</td>
                        <td>BMs Priority doctor coverage</td>
                        <td>100%</td>
                        <td>{blData?.BM_Priority_Drs_Coverage}</td>
                        <td>{blData?.BM_Priority_Drs_Coverage_Score}</td>
                        <td>{blYtdData?.BM_Priority_Drs_Coverage}</td>
                        <td>{blYtdData?.BM_Priority_Drs_Coverage_Score}</td>
                      </tr>
                      <tr>
                        <td>3%</td>
                        <td>% adherence to TP</td>
                        <td>95%</td>
                        <td>{blData?.TP_Adherence}</td>
                        <td>{blData?.TP_Adherence_Score}</td>
                        <td>{blYtdData?.TP_Adherence}</td>
                        <td>{blYtdData?.TP_Adherence_Score}</td>
                      </tr>
                      <tr>
                        <td>3%</td>
                        <td>Secondary variance</td>
                        <td>10%</td>
                        <td>{blData?.Secondary_Variance}</td>
                        <td>{blData?.Secondary_Variance_Score}</td>
                        <td>{blYtdData?.Secondary_Variance}</td>
                        <td>{blYtdData?.Secondary_Variance_Score}</td>
                      </tr>
                      <tr>
                        <td>2%</td>
                        <td>% of headquarters MSP (for HQ) vs Target taken cumulatively by BL</td>
                        <td>90%</td>
                        <td>{blData?.MSP_Compliance_Territories}</td>
                        <td>{blData?.MSP_Compliance_Territories_Score}</td>
                        <td>{blYtdData?.MSP_Compliance_Territories}</td>
                        <td>{blYtdData?.MSP_Compliance_Territories_Score}</td>
                      </tr>
                      <tr>
                        <td>2%</td>
                        <td>% of headquarters having MSR compliance with respect to Average Secondary Sales</td>
                        <td>90%</td>
                        <td>{blData?.MSR_Compliance_Territories}</td>
                        <td>{blData?.MSR_Compliance_Territories_Score}</td>
                        <td>{blYtdData?.MSR_Compliance_Territories}</td>
                        <td>{blYtdData?.MSR_Compliance_Territories_Score}</td>
                      </tr>
                      <tr className="shade">
                        <td>20%</td>
                        <td><b>Compliance & Reporting Score</b></td>
                        <td>20%</td>
                        <td>-</td>
                        <td><b>{fmt(totalFTMScore)}</b></td>
                        <td>-</td>
                        <td><b>{fmt(totalYTDScore)}</b></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== BH/SBUH TABLE ==================== */}
        {(role === 'BH' || role === 'SBUH') && bhBeData && bhYtdData && (
          <div className="table-container">
            <div className="efficiency-container">
              <HeadingWithHome>Performance Score</HeadingWithHome>
              <div className="efficiency-table-container">
                <div className="efficiency-table-scroll">
                  <table className="efficiency-table">
                    <thead>
                      <tr>
                        <th>Weightage</th>
                        <th>Parameter</th>
                        <th>Description</th>
                        <th>Objective</th>
                        <th>Month Val</th>
                        <th>Month Score</th>
                        <th>YTD Val</th>
                        <th>YTD Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* SFPI */}
                      <tr>
                        <td>5%</td>
                        <td rowSpan={3}><b>SFPI</b></td>
                        <td>No of Calls done (Self)</td>
                        <td>100</td>
                        <td>{bhBeData?.Calls}</td>
                        <td>{bhBeData?.Calls_Score}</td>
                        <td>{bhYtdData?.Calls}</td>
                        <td>{bhYtdData?.Calls_Score}</td>
                      </tr>
                      <tr>
                        <td>3%</td>
                        <td>Team's Customer Coverage</td>
                        <td>95%</td>
                        <td>{bhBeData?.Coverage}</td>
                        <td>{bhBeData?.Coverage_Score}</td>
                        <td>{bhYtdData?.Team_Coverage}</td>
                        <td>{bhYtdData?.Team_Coverage_Score}</td>
                      </tr>
                      <tr>
                        <td>3%</td>
                        <td>Team's Customer Compliance</td>
                        <td>90%</td>
                        <td>{bhBeData?.Compliance}</td>
                        <td>{bhBeData?.Compliance_Score}</td>
                        <td>{bhYtdData?.Team_Compliance}</td>
                        <td>{bhYtdData?.Team_Compliance_Score}</td>
                      </tr>

                      {/* Corporate Customer Engagement & Conversion Score */}
                      <tr>
                        <td>3%</td>
                        <td rowSpan={3}>
                          <b>
                            Corporate Customer Engagement
                            <br />& Conversion Score
                          </b>
                        </td>
                        <td>% of corporate doctors visited / 2 months (Out of 100 Selected)</td>
                        <td>90%</td>
                        <td>{bhBeData?.Priority_Drs_Coverage}</td>
                        <td>{bhBeData?.Priority_Drs_Coverage_Score}</td>
                        <td>{bhYtdData?.Corporate_Drs_Coverage}</td>
                        <td>{bhYtdData?.Corporate_Drs_Coverage_Score}</td>
                      </tr>
                      <tr>
                        <td>3%</td>
                        <td>% of Corporate doctors in active prescriber category</td>
                        <td>90%</td>
                        <td>{bhBeData?.Priority_RX_Drs}</td>
                        <td>{bhBeData?.Priority_RX_Drs_Score}</td>
                        <td>{bhYtdData?.Corporate_Drs_Active_Prescribers}</td>
                        <td>{bhYtdData?.Corporate_Drs_Active_Prescribers_Score}</td>
                      </tr>
                      <tr>
                        <td>3%</td>
                        <td>Priority Customer Coverage of BM</td>
                        <td>90%</td>
                        <td>{bhBeData?.BM_Priority_Drs_Coverage}</td>
                        <td>{bhBeData?.BM_Priority_Drs_Coverage_Score}</td>
                        <td>{bhYtdData?.BM_Priority_Drs_Coverage}</td>
                        <td>{bhYtdData?.BM_Priority_Drs_Coverage_Score}</td>
                      </tr>

                      {/* Total */}
                      <tr className="shade">
                        <td>20%</td>
                        <td colSpan={4}><b>Performance Score</b></td>
                        <td><b>{fmt(bhTotalFTMScore)}</b></td>
                        <td></td>
                        <td><b>{fmt(bhTotalYTDScore)}</b></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading states */}
        {role === 'BL' && (!blData || !blYtdData) && (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '50vh',
            fontSize: '18px',
            color: '#666'
          }}>
            Loading Compliance data...
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRole } from './RoleContext';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesLeft } from '@fortawesome/free-solid-svg-icons';
import useEncodedTerritory from './hooks/useEncodedTerritory';

export default function Miscfiles() {
  const navigate = useNavigate();
  const { role } = useRole();
  const { decoded, encoded } = useEncodedTerritory();

  // BM data states
  const [bmBeData, setBmBeData] = useState(null);
  const [bmYtdData, setBmYtdData] = useState(null);
  
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

        if (role === 'BM') {
          const [bmBeRes, bmYtdRes] = await Promise.all([
            fetch("https://review-backend-bgm.onrender.com/bmDashboardData", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ Territory: decoded }),
            }),
            fetch("https://review-backend-bgm.onrender.com/bmDashboardytdData", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ Territory: decoded }),
            }),
          ]);

          const bmBeJson = await bmBeRes.json();
          const bmYtdJson = await bmYtdRes.json();

          console.log("BM Hygiene BE data:", bmBeJson);
          console.log("BM Hygiene YTD data:", bmYtdJson);

          if (bmBeRes.ok) setBmBeData(bmBeJson);
          if (bmYtdRes.ok) setBmYtdData(bmYtdJson);
        }
        else if (role === 'BL') {
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

          console.log("BL Hygiene BE Data fetched:", blJson);
          console.log("BL Hygiene YTD Data fetched:", blYtdJson);

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

            console.log(`${role} Hygiene BE Data fetched:`, bhBeJson);
            console.log(`${role} Hygiene YTD Data fetched:`, bhYtdJson);

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
  const bmHygieneMonthScoreTotal =
    (Number(bmBeData?.Outstanding_FTM_Score) || 0) +
    (Number(bmBeData?.Returns_Percent_FTM_Score) || 0) +
    (Number(bmBeData?.CA_FTM_Score) || 0) +
    (Number(bmBeData?.Closing_FTM_Score) || 0);

  const bmHygieneYTDScoreTotal =
    (Number(bmYtdData?.Returns_Percent_YTD_Score) || 0) +
    (Number(bmYtdData?.CA_Percent_YTD_Score) || 0);

  const blHygieneMonthScoreTotal =
    (Number(blData?.Returns_Score) || 0) +
    (Number(blData?.Outstanding_Score) || 0) +
    (Number(blData?.Marketing_Activity_Sales_Score) || 0) +
    (Number(blData?.Closing_Score) || 0);

  const blHygieneYTDScoreTotal =
    (Number(blYtdData?.Returns_Score) || 0) +
    (Number(blYtdData?.Marketing_Activity_Sales_Score) || 0);

  const bhTotalFTMScore =
    (Number(bhBeData?.Returns_Score) || 0) +
    (Number(bhBeData?.Outstanding_Score) || 0) +
    (Number(bhBeData?.Marketing_Activity_Sales_Score) || 0) +
    (Number(bhBeData?.Closing_Score) || 0);

  const bhTotalYTDScore =
    (Number(bhYtdData?.Returns_Score) || 0) +
    (Number(bhYtdData?.Marketing_Activity_Sales_Score) || 0);

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
        {/* ==================== BM TABLE ==================== */}
        {role === 'BM' && bmBeData && bmYtdData && (
          <div className="table-container">
            <div className="efficiency-container">
              <HeadingWithHome>Hygiene</HeadingWithHome>
              <div className="efficiency-table-container">
                <div className="efficiency-table-scroll">
                  <table className="efficiency-table">
                    <thead>
                      <tr>
                        <th>Weightage</th>
                        <th>Parameter</th>
                        <th>Objective</th>
                        <th>Month</th>
                        <th>Month Score</th>
                        <th>YTD</th>
                        <th>YTD Score</th>
                        <th>Weightage (YTD)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>3%</td>
                        <td>Outstanding Days</td>
                        <td>30</td>
                        <td>{bmBeData?.Outstanding_FTM}</td>
                        <td>{bmBeData?.Outstanding_FTM_Score}</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                      </tr>
                      <tr>
                        <td>3%</td>
                        <td>Sales Returns</td>
                        <td>2%</td>
                        <td>{bmBeData?.Returns_Percent_FTM}</td>
                        <td>{bmBeData?.Returns_Percent_FTM_Score}</td>
                        <td>{bmYtdData?.Returns_Percent_YTD}</td>
                        <td>{bmYtdData?.Returns_Percent_YTD_Score}</td>
                        <td>5%</td>
                      </tr>
                      <tr>
                        <td>2%</td>
                        <td>% spent of RBO & CA</td>
                        <td>8%</td>
                        <td>{bmBeData?.CA_FTM}</td>
                        <td>{bmBeData?.CA_FTM_Score}</td>
                        <td>{bmYtdData?.CA_Percent_YTD}</td>
                        <td>{bmYtdData?.CA_Percent_YTD_Score}</td>
                        <td>5%</td>
                      </tr>
                      <tr>
                        <td>2%</td>
                        <td>Closing Days</td>
                        <td>45</td>
                        <td>{bmBeData?.Closing_FTM}</td>
                        <td>{bmBeData?.Closing_FTM_Score}</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                      </tr>
                      <tr className="shade">
                        <td>10%</td>
                        <td>Hygiene Score</td>
                        <td>10%</td>
                        <td>-</td>
                        <td><b>{fmt(bmHygieneMonthScoreTotal)}</b></td>
                        <td>-</td>
                        <td><b>{fmt(bmHygieneYTDScoreTotal)}</b></td>
                        <td>10%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== BL TABLE ==================== */}
        {role === "BL" && blData && blYtdData && (
          <div className="table-container">
            <div className="efficiency-container">
              <HeadingWithHome>
                Business Hygiene & Demand Quality
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
                        <td>% of Returns as % of secondary sales (Objectiveless than 2%)</td>
                        <td>2%</td>
                        <td>{blData?.Returns}</td>
                        <td>{blData?.Returns_Score}</td>
                        <td>{blYtdData?.Returns}</td>
                        <td>{blYtdData?.Returns_Score}</td>
                      </tr>
                      <tr>
                        <td>4%</td>
                        <td>DSO (days Sales Outstanding) per zone less than 30</td>
                        <td>30</td>
                        <td>{blData?.Outstanding}</td>
                        <td>{blData?.Outstanding_Score}</td>
                        <td>-</td>
                        <td>-</td>
                      </tr>
                      <tr>
                        <td>10%</td>
                        <td>% business driven by marketing activity</td>
                        <td>70%</td>
                        <td>{blData?.Marketing_Activity_Sales}</td>
                        <td>{blData?.Marketing_Activity_Sales_Score}</td>
                        <td>{blYtdData?.Marketing_Activity_Sales}</td>
                        <td>{blYtdData?.Marketing_Activity_Sales_Score}</td>
                      </tr>
                      <tr>
                        <td>3%</td>
                        <td>Avg. closing stock in days (should be ≤45days)</td>
                        <td>45</td>
                        <td>{blData?.Closing}</td>
                        <td>{blData?.Closing_Score}</td>
                        <td>-</td>
                        <td>-</td>
                      </tr>
                      <tr className="shade">
                        <td>20%</td>
                        <td><b>Business Hygiene & Demand Quality Score</b></td>
                        <td>20%</td>
                        <td>-</td>
                        <td><b>{fmt(blHygieneMonthScoreTotal)}</b></td>
                        <td>-</td>
                        <td><b>{fmt(blHygieneYTDScoreTotal)}</b></td>
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
              <HeadingWithHome>
                Business Hygiene & Demand Quality
              </HeadingWithHome>
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
                      <tr>
                        <td>5%</td>
                        <td><b>Return Ratio</b></td>
                        <td>% of Returns as % of secondary sales (Objective less than2%)</td>
                        <td>2%</td>
                        <td>{bhBeData?.Returns}</td>
                        <td>{bhBeData?.Returns_Score}</td>
                        <td>{bhYtdData?.Returns}</td>
                        <td>{bhYtdData?.Returns_Score}</td>
                      </tr>
                      <tr>
                        <td>5%</td>
                        <td><b>Outstanding Days</b></td>
                        <td>DSO (days Sales Outstanding) less than 30</td>
                        <td>30</td>
                        <td>{bhBeData?.Outstanding}</td>
                        <td>{bhBeData?.Outstanding_Score}</td>
                        <td>-</td>
                        <td>-</td>
                      </tr>
                      <tr>
                        <td>5%</td>
                        <td><b>Business generated through MA</b></td>
                        <td>% business driven by marketing activity</td>
                        <td>70%</td>
                        <td>{bhBeData?.Marketing_Activity_Sales}</td>
                        <td>{bhBeData?.Marketing_Activity_Sales_Score}</td>
                        <td>{bhYtdData?.Marketing_Activity_Sales}</td>
                        <td>{bhYtdData?.Marketing_Activity_Sales_Score}</td>
                      </tr>
                      <tr>
                        <td>5%</td>
                        <td><b>Closing Stock Index</b></td>
                        <td>Avg closing stock in days (should be ≤45 days)</td>
                        <td>45</td>
                        <td>{bhBeData?.Closing}</td>
                        <td>{bhBeData?.Closing_Score}</td>
                        <td>-</td>
                        <td>-</td>
                      </tr>
                      <tr className="shade">
                        <td>20%</td>
                        <td colSpan={4}>
                          <b>Business Hygiene & Demand Quality Score</b>
                        </td>
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

        {/* Loading states for other roles */}
        {role === 'BM' && (!bmBeData || !bmYtdData) && (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '50vh',
            fontSize: '18px',
            color: '#666'
          }}>
            Loading Hygiene data...
          </div>
        )}

        {role === 'BL' && (!blData || !blYtdData) && (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '50vh',
            fontSize: '18px',
            color: '#666'
          }}>
            Loading Business Hygiene data...
          </div>
        )}
      </div>
    </div>
  );
}

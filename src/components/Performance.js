import React, { useState, useEffect } from "react";

import { useRole } from "./RoleContext";
import { useNavigate } from "react-router-dom";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesLeft } from "@fortawesome/free-solid-svg-icons";
import useEncodedTerritory from "./hooks/useEncodedTerritory";

export default function Performance() {
  const navigate = useNavigate();
  const { role } = useRole();
  const { decoded, encoded } = useEncodedTerritory();

  const [beData, setBeData] = useState(null);
  const [ytdData, setYtdData] = useState(null);

  // BM data states
  const [bmBeData, setBmBeData] = useState(null);
  const [bmYtdData, setBmYtdData] = useState(null);


  const [blData, setBlData] = useState(null);
  const [blYtdData, setBlYtdData] = useState(null);


  const [bhBeData, setBhBeData] = useState(null);
  const [bhYtdData, setBhYtdData] = useState(null);

  // BH/SBUH Division states
  const [divisions, setDivisions] = useState([]);
  const [selectedDivision, setSelectedDivision] = useState('');
  const [isLoadingDivisions, setIsLoadingDivisions] = useState(false);

  const fmt = (v) => Number(parseFloat(v || 0)).toFixed(2);

  // Fetch divisions for BH/SBUH
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
    // Clear BH/SBUH data while loading new division
    setBhBeData(null);
    setBhYtdData(null);
  };

  useEffect(() => {
    if (!decoded) return;

    const loadAll = async () => {
      try {
        NProgress.start();

        if (role === "BE") {
          // Existing BE endpoints
          const [beRes, ytdRes] = await Promise.all([
            fetch("https://review-backend-bgm.onrender.com/dashboardData", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ Territory: decoded }),
            }),
            fetch("https://review-backend-bgm.onrender.com/dashboardytdData", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ Territory: decoded }),
            }),
          ]);

          const beJson = await beRes.json();
          const ytdJson = await ytdRes.json();

          if (beRes.ok) setBeData(beJson);
          if (ytdRes.ok) setYtdData(ytdJson);
        }
        else if (role === "BM") {
          // BM endpoints
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

          console.log("BM Effort BE Data:", bmBeJson);
          console.log("BM Effort YTD Data:", bmYtdJson);

          if (bmBeRes.ok) setBmBeData(bmBeJson);
          if (bmYtdRes.ok) setBmYtdData(bmYtdJson);
        }
        else if (role === 'BL') {
          // BL endpoints
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

          console.log("BL Data fetched:", blJson);
          console.log("BL YTD Data fetched:", blYtdJson);

          if (blRes.ok) setBlData(blJson);
          if (blYtdRes.ok) setBlYtdData(blYtdJson);
        }
        else if (['BH', 'SBUH'].includes(role)) {
          // Fetch divisions first for BH/SBUH
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

            console.log(`${role} BE Data fetched:`, bhBeJson);
            console.log(`${role} YTD Data fetched:`, bhYtdJson);

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

  const HomePage = () => {
    navigate(`/FinalReport?ec=${encoded}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const HeadingWithHome = ({ level, children }) => {
    const HeadingTag = "h3";
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <HeadingTag style={{ margin: 0, textAlign: "center" }}>
          {children}
        </HeadingTag>
        <button
          style={{
            background: "none",
            border: "none",
            color: "black",
            fontSize: "16px",
            cursor: "pointer",
            padding: 0,
          }}
          onClick={HomePage}
        >
          <FontAwesomeIcon icon={faAnglesLeft} size="1x" />
        </button>
      </div>
    );
  };

  // ------------------------------------------------
  // BE TOTAL SCORES
  // ------------------------------------------------
  const totalYTDScore =
    (Number(ytdData?.Calls_Score) || 0) +
    (Number(ytdData?.Coverage_Score) || 0) +
    (Number(ytdData?.Compliance_Score) || 0) +
    (Number(ytdData?.RCPA_Score) || 0) +
    (Number(ytdData?.Activity_Implementation_Score) || 0);

  const totalFTDScore =
    (Number(beData?.Calls_Score) || 0) +
    (Number(beData?.Coverage_Score) || 0) +
    (Number(beData?.Compliance_Score) || 0) +
    (Number(beData?.RCPA_Score) || 0) +
    (Number(beData?.Activity_Implementation_Score) || 0);

  // ------------------------------------------------
  // BM TOTAL SCORES
  // ------------------------------------------------
  const bmTotalFTMScore =
    (Number(bmBeData?.Priority_Drs_Met_FTM_Score) || 0) +
    (Number(bmBeData?.Calls_FTM_Score) || 0) +
    (Number(bmBeData?.Coverage_Score2) || 0) +
    (Number(bmBeData?.Compliance_Score2) || 0) +
    (Number(bmBeData?.Marketing_Implementation_FTM_Score) || 0) +
    (Number(bmBeData?.MSP_Compliance_FTM_Score) || 0) +
    (Number(bmBeData?.Priority_RX_Drs_FTM_Score) || 0) +
    (Number(bmBeData?.MSR_Comp_FTM_Score) || 0);

  const bmTotalYTDScore =
    (Number(bmYtdData?.Priority_Drs_Met_YTD_Score) || 0) +
    (Number(bmYtdData?.Calls_YTD_Score) || 0) +
    (Number(bmYtdData?.Coverage_YTD_Score) || 0) +
    (Number(bmYtdData?.Compliance_YTD_Score) || 0) +
    (Number(bmYtdData?.Marketing_Implementation_YTD_Score) || 0) +
    (Number(bmYtdData?.MSP_Compliance_YTD_Score) || 0) +
    (Number(bmYtdData?.Priority_RX_Drs_YTD_Score) || 0) +
    (Number(bmYtdData?.MSR_Compliance_YTD_Score) || 0);

  // ------------------------------------------------
  // BL TOTAL SCORES (NEW)
  // ------------------------------------------------
  const blTotalFTMScore =
    (Number(blData?.Hiring_Quality_Index_Score) || 0) +
    (Number(blData?.Induction_Score) || 0) +
    (Number(blData?.Infant_Attrition_Rate_Score) || 0) +
    (Number(blData?.Overall_Attrition_Rate_Score) || 0);

  const blTotalYTDScore =
    (Number(blYtdData?.Hiring_Quality_Index_Score) || 0) +
    (Number(blYtdData?.Induction_Score) || 0) +
    (Number(blYtdData?.Infant_Attrition_Rate_Score) || 0) +
    (Number(blYtdData?.Overall_Attrition_Rate_Score) || 0);


  const bhTotalFTMScore =
    (Number(bhBeData?.Overall_Attrition_Rate_Score) || 0) +
    (Number(bhBeData?.Secondary_Variance_Score) || 0) +

    (Number(bhBeData?.MSP_Compliance_Territories_Score) || 0) +
    (Number(bhBeData?.MSR_Compliance_Territories_Score) || 0) +

    (Number(bhBeData?.BE_Active_vs_Sanctioned_Score) || 0) +
    (Number(bhBeData?.BM_BL_Active_Vs_Sanctioned_Score) || 0);

  const bhTotalYTDScore =
    (Number(bhYtdData?.Overall_Attrition_Rate_Score) || 0) +
    (Number(bhYtdData?.Secondary_Variance_Score) || 0) +
    (Number(bhYtdData?.MSP_Compliance_Territories_Score) || 0) +
    (Number(bhYtdData?.MSR_Compliance_Territories_Score) || 0)




  // BH/SBUH Loading/Selection Screen (match Home.js behavior)
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

      <div className="table-box">
        {role === "BE" && (
          <div className="table-container">
            <div className="efficiency-container">
              <HeadingWithHome level="h1">
                Efforts and Effectiveness
              </HeadingWithHome>

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
                      </tr>
                    </thead>

                    <tbody>
                      <tr>
                        <td>10%</td>
                        <td>Calls</td>
                        <td>240</td>
                        <td>{beData?.Doctor_Calls}</td>
                        <td>{beData?.Calls_Score}</td>
                        <td>{ytdData?.Doctor_Calls}</td>
                        <td>{ytdData?.Calls_Score}</td>
                      </tr>

                      <tr>
                        <td>10%</td>
                        <td>Coverage %</td>
                        <td>95</td>
                        <td>{beData?.Coverage}</td>
                        <td>{beData?.Coverage_Score}</td>
                        <td>{ytdData?.Coverage}</td>
                        <td>{ytdData?.Coverage_Score}</td>
                      </tr>

                      <tr>
                        <td>10%</td>
                        <td>Compliance %</td>
                        <td>90</td>
                        <td>{beData?.Compliance}</td>
                        <td>{beData?.Compliance_Score}</td>
                        <td>{ytdData?.Compliance}</td>
                        <td>{ytdData?.Compliance_Score}</td>
                      </tr>

                      <tr>
                        <td>10%</td>
                        <td>RCPA %</td>
                        <td>100</td>
                        <td>{beData?.Chemist_Met}</td>
                        <td>{beData?.RCPA_Score}</td>
                        <td>{ytdData?.Chemist_Met}</td>
                        <td>{ytdData?.RCPA_Score}</td>
                      </tr>

                      <tr>
                        <td>10%</td>
                        <td>Activity Implementation %</td>
                        <td>100</td>
                        <td>{beData?.Activity_Implementation}</td>
                        <td>{beData?.Activity_Implementation_Score}</td>
                        <td>{ytdData?.Activity_Implementation}</td>
                        <td>{ytdData?.Activity_Implementation_Score}</td>
                      </tr>

                      <tr className="shade">
                        <td>50%</td>
                        <td>Effort Score</td>
                        <td>-</td>
                        <td>-</td>
                        <td><b>{fmt(totalFTDScore)}</b></td>
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

        {role === "BM" && (
          <div className="table-container">
            <div className="efficiency-container">
              <HeadingWithHome level="h1">
                Efforts and Effectiveness
              </HeadingWithHome>

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
                      </tr>
                    </thead>

                    <tbody>
                      <tr>
                        <td>5%</td>
                        <td>Self Priority Customer Covg</td>
                        <td>100%</td>
                        <td>{bmBeData?.Priority_Drs_Met_FTM}</td>
                        <td>{bmBeData?.Priority_Drs_Met_FTM_Score}</td>
                        <td>{bmYtdData?.Priority_Drs_Met_YTD}</td>
                        <td>{bmYtdData?.Priority_Drs_Met_YTD_Score}</td>
                      </tr>

                      <tr>
                        <td>5%</td>
                        <td>No of Calls - Self</td>
                        <td>220</td>
                        <td>{bmBeData?.Calls_FTM}</td>
                        <td>{bmBeData?.Calls_FTM_Score}</td>
                        <td>{bmYtdData?.Calls_YTD}</td>
                        <td>{bmYtdData?.Calls_YTD_Score}</td>
                      </tr>

                      <tr>
                        <td>5%</td>
                        <td>Team's Coverage</td>
                        <td>95%</td>
                        <td>{bmBeData?.Coverage2}</td>
                        <td>{bmBeData?.Coverage_Score2}</td>
                        <td>{bmYtdData?.Coverage_YTD}</td>
                        <td>{bmYtdData?.Coverage_YTD_Score}</td>
                      </tr>

                      <tr>
                        <td>5%</td>
                        <td>Team's Compliance</td>
                        <td>90%</td>
                        <td>{bmBeData?.Compliance2}</td>
                        <td>{bmBeData?.Compliance_Score2}</td>
                        <td>{bmYtdData?.Compliance_YTD}</td>
                        <td>{bmYtdData?.Compliance_YTD_Score}</td>
                      </tr>

                      <tr>
                        <td>5%</td>
                        <td>Marketing Implementation (inputs for >30 Days)</td>
                        <td>100%</td>
                        <td>{bmBeData?.Marketing_Implementation_FTM}</td>
                        <td>{bmBeData?.Marketing_Implementation_FTM_Score}</td>
                        <td>{bmYtdData?.Marketing_Implementation_YTD}</td>
                        <td>{bmYtdData?.Marketing_Implementation_YTD_Score}</td>
                      </tr>

                      <tr>
                        <td>5%</td>
                        <td>% Tty MSP Compliance (vs Target)</td>
                        <td>100%</td>
                        <td>{bmBeData?.MSP_Compliance_FTM}</td>
                        <td>{bmBeData?.MSP_Compliance_FTM_Score}</td>
                        <td>{bmYtdData?.MSP_Compliance_YTD}</td>
                        <td>{bmYtdData?.MSP_Compliance_YTD_Score}</td>
                      </tr>

                      <tr>
                        <td>5%</td>
                        <td>Dr. Conversion (Self Prio)</td>
                        <td>100%</td>
                        <td>{bmBeData?.Priority_RX_Drs_FTM}</td>
                        <td>{bmBeData?.Priority_RX_Drs_FTM_Score}</td>
                        <td>{bmYtdData?.Priority_RX_Drs_YTD}</td>
                        <td>{bmYtdData?.Priority_RX_Drs_YTD_Score}</td>
                      </tr>

                      <tr>
                        <td>5%</td>
                        <td>% Tty MSR Compliance (vs Sec)</td>
                        <td>100%</td>
                        <td>{bmBeData?.MSR_Comp_FTM}</td>
                        <td>{bmBeData?.MSR_Comp_FTM_Score}</td>
                        <td>{bmYtdData?.MSR_Compliance_YTD}</td>
                        <td>{bmYtdData?.MSR_Compliance_YTD_Score}</td>
                      </tr>

                      <tr className="shade">
                        <td>40%</td>
                        <td>Effort Score</td>
                        <td>40%</td>
                        <td>-</td>
                        <td><b>{fmt(bmTotalFTMScore)}</b></td>
                        <td>-</td>
                        <td><b>{fmt(bmTotalYTDScore)}</b></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {role === "BL" && (
          <div className="table-container">
            <div className="efficiency-container">
              <HeadingWithHome level="h1">
                Efforts and Effectiveness
              </HeadingWithHome>

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
                      </tr>
                    </thead>

                    <tbody>
                      <tr>
                        <td>5%</td>
                        <td>% of proposed candidates Approved by<br /> BHR vs Submitted to BHR by BL</td>
                        <td>100%</td>
                        <td>{blData?.Hiring_Quality_Index}</td>
                        <td>{blData?.Hiring_Quality_Index_Score}</td>
                        <td>{blYtdData?.Hiring_Quality_Index}</td>
                        <td>{blYtdData?.Hiring_Quality_Index_Score}</td>
                      </tr>

                      <tr>
                        <td>5%</td>
                        <td>*% of New Joinees Clearing induction in Pravesh</td>
                        <td>90%</td>
                        <td>{blData?.Induction}</td>
                        <td>{blData?.Induction_Score}</td>
                        <td>{blYtdData?.Induction}</td>
                        <td>{blYtdData?.Induction_Score}</td>
                      </tr>

                      <tr>
                        <td>5%</td>
                        <td>*Infant aatrition rate (within 180 days)</td>
                        <td>20%</td>
                        <td>{blData?.Infant_Attrition_Rate}</td>
                        <td>{blData?.Infant_Attrition_Rate_Score}</td>
                        <td>{blYtdData?.Infant_Attrition_Rate}</td>
                        <td>{blYtdData?.Infant_Attrition_Rate_Score}</td>
                      </tr>

                      <tr>
                        <td>5%</td>
                        <td>Overall attrition rate (Annual rate in current FY)</td>
                        <td>20%</td>
                        <td>{blData?.Overall_Attrition_Rate}</td>
                        <td>{blData?.Overall_Attrition_Rate_Score}</td>
                        <td>{blYtdData?.Overall_Attrition_Rate}</td>
                        <td>{blYtdData?.Overall_Attrition_Rate_Score}</td>
                      </tr>

                      <tr className="shade">
                        <td>20%</td>
                        <td><b>Team Building Score</b></td>
                        <td>20%</td>
                        <td>-</td>
                        <td><b>{fmt(blTotalFTMScore)}</b></td>
                        <td>-</td>
                        <td><b>{fmt(blTotalYTDScore)}</b></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {(role === 'BH' || role === 'SBUH') && (
          <div className="table-container">
            <div className="efficiency-container">
              <HeadingWithHome>Team & Culture Building</HeadingWithHome>

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
                        <td><b>Team Stability</b></td>
                        <td>Overall attrition rate</td>
                        <td>20%</td>
                        <td>{bhBeData?.Overall_Attrition_Rate}</td>
                        <td>{bhBeData?.Overall_Attrition_Rate_Score}</td>
                        <td>{bhYtdData?.Overall_Attrition_Rate}</td>
                        <td>{bhYtdData?.Overall_Attrition_Rate_Score}</td>
                      </tr>

                      <tr>
                        <td>4%</td>
                        <td><b>Reporting Integrity</b></td>
                        <td>Secondary variance</td>
                        <td>10%</td>
                        <td>{bhBeData?.Secondary_Variance}</td>
                        <td>{bhBeData?.Secondary_Variance_Score}</td>
                        <td>{bhYtdData?.Secondary_Variance}</td>
                        <td>{bhYtdData?.Secondary_Variance_Score}</td>
                      </tr>




                      <tr>
                        <td>2%</td>
                        <td rowSpan={2}><b>MSR Compliance</b></td>
                        <td>% of headquarters audited</td>
                        <td>90%</td>

                        <td>{bhBeData?.MSP_Compliance_Territories}</td>
                        <td>{bhBeData?.MSP_Compliance_Territories_Score}</td>
                        <td>{bhYtdData?.MSP_Compliance_Territories}</td>
                        <td>{bhYtdData?.MSP_Compliance_Territories_Score}</td>
                      </tr>

                      <tr>
                        <td>2%</td>
                        <td>% of headquarters compliant</td>
                        <td>90%</td>
                        <td>{bhBeData?.MSR_Compliance_Territories}</td>
                        <td>{bhBeData?.MSR_Compliance_Territories_Score}</td>
                        <td>{bhYtdData?.MSR_Compliance_Territories}</td>
                        <td>{bhYtdData?.MSR_Compliance_Territories_Score}</td>
                      </tr>

                      <tr>
                        <td>3%</td>
                        <td><b>BE</b></td>
                        <td># of BE Active Vs Sanctioned</td>
                        <td>100%</td>
                        <td>{bhBeData?.BE_Active_vs_Sanctioned}</td>
                        <td>{bhBeData?.BE_Active_vs_Sanctioned_Score}</td>
                        <td>-</td>
                        <td>-</td>
                      </tr>

                      <tr>
                        <td>4%</td>
                        <td><b>BM & BL</b></td>
                        <td># of BM & BL Active Vs</td>
                        <td>100%</td>
                        <td>{bhBeData?.BM_BL_Active_Vs_Sanctioned}</td>
                        <td>{bhBeData?.BM_BL_Active_Vs_Sanctioned_Score}</td>
                        <td>-</td>
                        <td>-</td>
                      </tr>

                      <tr className="shade">
                        <td>20%</td>
                        <td colSpan={4}><b>Team & Culture Building Score</b></td>
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

      </div>
    </div>
  );
}

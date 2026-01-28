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
  
  const [blData, setBlData] = useState(null);
  const [blYtdData, setBlYtdData] = useState(null);

  const { role } = useRole();
  
  // decode base64 -> original territory
  const { decoded, encoded } = useEncodedTerritory();

  const HomePage = () => {
    navigate(`/FinalReport?ec=${encoded}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const HeadingWithHome = ({ level, children }) => {
    const HeadingTag = "h3";
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "10px"
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
            padding: 0
          }}
          onClick={HomePage}
        >
          <FontAwesomeIcon icon={faAnglesLeft} size="1x" />
        </button>
      </div>
    );
  };

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

          console.log("BL Data fetched:", blJson);
          console.log("BL YTD Data fetched:", blYtdJson);

          if (blRes.ok) setBlData(blJson);
          if (blYtdRes.ok) setBlYtdData(blYtdJson);
        }
      } catch (err) {
        console.error("API error:", err);
      } finally {
        NProgress.done();
      }
    };

    loadAll();
  }, [decoded, role]);

  // ------------------------------------------------
  //          COMMITMENT TOTAL SCORES (NEW)
  // ------------------------------------------------
  const fmt = (v) => Number(parseFloat(v || 0)).toFixed(2);

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

  return (
    <div>
      <div className='table-box'>
        {role === "BL" && (
          <div className="efficiency-container">
            <HeadingWithHome level="h1">
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
        )}
      </div>
    </div>
  )
}

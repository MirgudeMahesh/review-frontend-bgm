import React, { useState, useEffect } from 'react';
import '../../styles.css';
import Subnavbar from '../Subnavbar';
import { useRole } from '../RoleContext';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import useProfileTerritory from '../hooks/useProfileTerritory';

export default function UserCommitment() {
  const { userRole, name } = useRole();
  const { profileTerritory } = useProfileTerritory();
  
  const [blBeData, setBlBeData] = useState(null);
  const [blYtdData, setBlYtdData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!profileTerritory || userRole !== 'BL') {
      return;
    }

    const loadBLData = async () => {
      try {
        setIsLoading(true);
        NProgress.start();

        // Both BL URLs - following exact pattern
        const beUrl = "https://review-backend-bgm.onrender.com/blDashboardData";
        const ytdUrl = "https://review-backend-bgm.onrender.com/blDashboardytdData";

        const [beRes, ytdRes] = await Promise.all([
          fetch(beUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ Territory: profileTerritory }),
          }),
          fetch(ytdUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ Territory: profileTerritory }),
          }),
        ]);

        const beJson = await beRes.json();
        const ytdJson = await ytdRes.json();

        console.log("BL Commitment BE Data:", beJson);
        console.log("BL Commitment YTD Data:", ytdJson);

        if (beRes.ok) setBlBeData(beJson);
        if (ytdRes.ok) setBlYtdData(ytdJson);
      } catch (err) {
        console.error("BL Commitment API error:", err);
      } finally {
        setIsLoading(false);
        NProgress.done();
      }
    };

    loadBLData();
  }, [profileTerritory, userRole]);

  // Show loader only when actually loading BL data
  if (isLoading) {
    return <p style={{ textAlign: "center" }}>Loading...</p>;
  }

  const fmt = (v) => Number(parseFloat(v || 0)).toFixed(2);

  // COMMITMENT TOTAL SCORES (Dynamic)
  const totalFTMScore =
    (Number(blBeData?.Team_Coverage_Score) || 0) +
    (Number(blBeData?.Team_Compliance_Score) || 0) +
    (Number(blBeData?.BM_Priority_Drs_Coverage_Score) || 0) +
    (Number(blBeData?.TP_Adherence_Score) || 0) +
    (Number(blBeData?.Secondary_Variance_Score) || 0) +
    (Number(blBeData?.MSP_Compliance_Territories_Score) || 0) +
    (Number(blBeData?.MSR_Compliance_Territories_Score) || 0);

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
      <div className="table-box">
        <div className="table-container">
          {/* BL Compliance & Reporting Table - DYNAMIC DATA */}
          {userRole === 'BL' && (
            <div className="efficiency-container">
              {name && <Subnavbar />}
              <h3 style={{ textAlign: 'center' }}>Compliance & Reporting</h3>

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
                        <td>{blBeData?.Team_Coverage}</td>
                        <td>{blBeData?.Team_Coverage_Score}</td>
                        <td>{blYtdData?.Team_Coverage}</td>
                        <td>{blYtdData?.Team_Coverage_Score}</td>
                      </tr>
                      <tr>
                        <td>3%</td>
                        <td>Team's Customer Compliance</td>
                        <td>90%</td>
                        <td>{blBeData?.Team_Compliance}</td>
                        <td>{blBeData?.Team_Compliance_Score}</td>
                        <td>{blYtdData?.Team_Compliance}</td>
                        <td>{blYtdData?.Team_Compliance_Score}</td>
                      </tr>
                      <tr>
                        <td>4%</td>
                        <td>BMs Priority doctor coverage</td>
                        <td>100%</td>
                        <td>{blBeData?.BM_Priority_Drs_Coverage}</td>
                        <td>{blBeData?.BM_Priority_Drs_Coverage_Score}</td>
                        <td>{blYtdData?.BM_Priority_Drs_Coverage}</td>
                        <td>{blYtdData?.BM_Priority_Drs_Coverage_Score}</td>
                      </tr>
                      <tr>
                        <td>3%</td>
                        <td>% adherence to TP</td>
                        <td>95%</td>
                        <td>{blBeData?.TP_Adherence}</td>
                        <td>{blBeData?.TP_Adherence_Score}</td>
                        <td>{blYtdData?.TP_Adherence}</td>
                        <td>{blYtdData?.TP_Adherence_Score}</td>
                      </tr>
                      <tr>
                        <td>3%</td>
                        <td>Secondary variance</td>
                        <td>10%</td>
                        <td>{blBeData?.Secondary_Variance}</td>
                        <td>{blBeData?.Secondary_Variance_Score}</td>
                        <td>{blYtdData?.Secondary_Variance}</td>
                        <td>{blYtdData?.Secondary_Variance_Score}</td>
                      </tr>
                      <tr>
                        <td>2%</td>
                        <td>% of headquarters MSP (for HQ) vs Target taken cumulatively by BL</td>
                        <td>90%</td>
                        <td>{blBeData?.MSP_Compliance_Territories}</td>
                        <td>{blBeData?.MSP_Compliance_Territories_Score}</td>
                        <td>{blYtdData?.MSP_Compliance_Territories}</td>
                        <td>{blYtdData?.MSP_Compliance_Territories_Score}</td>
                      </tr>
                      <tr>
                        <td>2%</td>
                        <td>% of headquarters having MSR compliance with respect to Average Secondary Sales</td>
                        <td>90%</td>
                        <td>{blBeData?.MSR_Compliance_Territories}</td>
                        <td>{blBeData?.MSR_Compliance_Territories_Score}</td>
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
    </div>
  );
}

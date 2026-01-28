import React, { useState, useEffect } from "react";
import "../../styles.css";
import Textarea from "../Textarea";
import ActualCommit from "../ActualCommit";
import Navbar from "../Navbar";
import { useRole } from "../RoleContext";
import Subnavbar from "../Subnavbar";
import Chats from "./Chats";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import useProfileTerritory from "../hooks/useProfileTerritory";

export default function UserPerformance() {
  const { profileTerritory } = useProfileTerritory();
  const { name, userRole } = useRole();

  const [beData, setBeData] = useState(null);
  const [ytdData, setYtdData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!profileTerritory) {
      setIsLoading(false);
      return;
    }

    const loadAll = async () => {
      try {
        setIsLoading(true);
        NProgress.start();

        // BM/BE/BL API calls
        let beUrl = "";
        let ytdUrl = "";

        if (userRole === "BM") {
          beUrl = "https://review-backend-bgm.onrender.com/bmDashboardData";
          ytdUrl = "https://review-backend-bgm.onrender.com/bmDashboardytdData";
        } else if(userRole==='BE') {
          beUrl = "https://review-backend-bgm.onrender.com/dashboardData";
          ytdUrl = "https://review-backend-bgm.onrender.com/dashboardytdData";
        }
         else if(userRole==='BL') {
          beUrl = "https://review-backend-bgm.onrender.com/blDashboardData";
          ytdUrl = "https://review-backend-bgm.onrender.com/blDashboardytdData";
        }

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

        console.log("UserPerformance BE/BM/BL Month Data:", beJson);
        console.log("UserPerformance BE/BM/BL YTD Data:", ytdJson);

        if (beRes.ok) setBeData(beJson);
        if (ytdRes.ok) setYtdData(ytdJson);
      } catch (err) {
        console.error("API error:", err);
      } finally {
        setIsLoading(false);
        NProgress.done();
      }
    };

    loadAll();
  }, [profileTerritory, userRole]);

  // Show loader only when actually loading
  if (isLoading) {
    return <p style={{ textAlign: "center" }}>Loading...</p>;
  }

  // ----------------------------
  // TOTAL SCORES (Efforts) - Now BL uses real API data
  // ----------------------------
  let totalYTDScore = 0;
  let totalFTDScore = 0;

  if (userRole === "BM") {
    // BM Efforts totals
    totalYTDScore = (
      (Number(ytdData?.Priority_Drs_Met_YTD_Score) || 0) +
      (Number(ytdData?.Calls_YTD_Score) || 0) +
      (Number(ytdData?.Coverage_YTD_Score) || 0) +
      (Number(ytdData?.Compliance_YTD_Score) || 0) +
      (Number(ytdData?.Marketing_Implementation_YTD_Score) || 0) +
      (Number(ytdData?.MSP_Compliance_YTD_Score) || 0) +
      (Number(ytdData?.Priority_RX_Drs_YTD_Score) || 0) +
      (Number(ytdData?.MSR_Compliance_YTD_Score) || 0)
    );
    totalFTDScore = (
      (Number(beData?.Priority_Drs_Met_FTM_Score) || 0) +
      (Number(beData?.Calls_FTM_Score) || 0) +
      (Number(beData?.Coverage_Score2) || 0) +
      (Number(beData?.Compliance_Score2) || 0) +
      (Number(beData?.Marketing_Implementation_FTM_Score) || 0) +
      (Number(beData?.MSP_Compliance_FTM_Score) || 0) +
      (Number(beData?.Priority_RX_Drs_FTM_Score) || 0) +
      (Number(beData?.MSR_Comp_FTM_Score) || 0)
    );
  } else if (userRole === "BE") {
    // BE Efforts totals
    totalYTDScore = (
      Number(ytdData?.Calls_Score || 0) +
      Number(ytdData?.Coverage_Score || 0) +
      Number(ytdData?.Compliance_Score || 0) +
      Number(ytdData?.RCPA_Score || 0) +
      Number(ytdData?.Activity_Implementation_Score || 0)
    );
    totalFTDScore = (
      Number(beData?.Calls_Score || 0) +
      Number(beData?.Coverage_Score || 0) +
      Number(beData?.Compliance_Score || 0) +
      Number(beData?.RCPA_Score || 0) +
      Number(beData?.Activity_Implementation_Score || 0)
    );
  } else if (userRole === "BL") {
    // BL Team Building totals - NOW DYNAMIC from API
    totalFTDScore = (
      (Number(beData?.Hiring_Quality_Index_Score) || 0) +
      (Number(beData?.Induction_Score) || 0) +
      (Number(beData?.Infant_Attrition_Rate_Score) || 0) +
      (Number(beData?.Overall_Attrition_Rate_Score) || 0)
    );
    totalYTDScore = (
      (Number(ytdData?.Hiring_Quality_Index_Score) || 0) +
      (Number(ytdData?.Induction_Score) || 0) +
      (Number(ytdData?.Infant_Attrition_Rate_Score) || 0) +
      (Number(ytdData?.Overall_Attrition_Rate_Score) || 0)
    );
  }

  const fmt = (v) => Number(parseFloat(v || 0)).toFixed(2);

  return (
    <div>
      <div className="table-box">
        <div className="table-container">
          <div className="efficiency-container">
            {name && <Subnavbar />}

            <h3 style={{ textAlign: "center" }}>Efforts and Effectiveness</h3>

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
                    {userRole === "BM" ? (
                      <>
                        <tr>
                          <td>5%</td><td>Self Priority Customer Covg</td><td>100%</td>
                          <td>{beData?.Priority_Drs_Met_FTM}</td><td>{beData?.Priority_Drs_Met_FTM_Score}</td>
                          <td>{ytdData?.Priority_Drs_Met_YTD}</td><td>{ytdData?.Priority_Drs_Met_YTD_Score}</td>
                        </tr>
                        <tr>
                          <td>5%</td><td>No of Calls - Self</td><td>220</td>
                          <td>{beData?.Calls_FTM}</td><td>{beData?.Calls_FTM_Score}</td>
                          <td>{ytdData?.Calls_YTD}</td><td>{ytdData?.Calls_YTD_Score}</td>
                        </tr>
                        <tr>
                          <td>5%</td><td>Team's Coverage</td><td>95%</td>
                          <td>{beData?.Coverage2}</td><td>{beData?.Coverage_Score2}</td>
                          <td>{ytdData?.Coverage_YTD}</td><td>{ytdData?.Coverage_YTD_Score}</td>
                        </tr>
                        <tr>
                          <td>5%</td><td>Team's Compliance</td><td>90%</td>
                          <td>{beData?.Compliance2}</td><td>{beData?.Compliance_Score2}</td>
                          <td>{ytdData?.Compliance_YTD}</td><td>{ytdData?.Compliance_YTD_Score}</td>
                        </tr>
                        <tr>
                          <td>5%</td><td>Marketing Implementation (inputs for >30 Days)</td><td>100%</td>
                          <td>{beData?.Marketing_Implementation_FTM}</td><td>{beData?.Marketing_Implementation_FTM_Score}</td>
                          <td>{ytdData?.Marketing_Implementation_YTD}</td><td>{ytdData?.Marketing_Implementation_YTD_Score}</td>
                        </tr>
                        <tr>
                          <td>5%</td><td>% Tty MSP Compliance (vs Target)</td><td>100%</td>
                          <td>{beData?.MSP_Compliance_FTM}</td><td>{beData?.MSP_Compliance_FTM_Score}</td>
                          <td>{ytdData?.MSP_Compliance_YTD}</td><td>{ytdData?.MSP_Compliance_YTD_Score}</td>
                        </tr>
                        <tr>
                          <td>5%</td><td>Dr. Conversion (Self Prio)</td><td>100%</td>
                          <td>{beData?.Priority_RX_Drs_FTM}</td><td>{beData?.Priority_RX_Drs_FTM_Score}</td>
                          <td>{ytdData?.Priority_RX_Drs_YTD}</td><td>{ytdData?.Priority_RX_Drs_YTD_Score}</td>
                        </tr>
                        <tr>
                          <td>5%</td><td>% Tty MSR Compliance (vs Sec)</td><td>100%</td>
                          <td>{beData?.MSR_Comp_FTM}</td><td>{beData?.MSR_Comp_FTM_Score}</td>
                          <td>{ytdData?.MSR_Compliance_YTD}</td><td>{ytdData?.MSR_Compliance_YTD_Score}</td>
                        </tr>
                        <tr className="shade">
                          <td>40%</td><td>Effort Score</td><td>-</td>
                          <td>-</td><td><b>{fmt(totalFTDScore)}</b></td><td>-</td><td><b>{fmt(totalYTDScore)}</b></td>
                        </tr>
                      </>
                    ) : userRole === "BL" ? (
                      <>
                        <tr>
                          <td>5%</td>
                          <td>% of proposed candidates Approved by<br/>BHR vs Submitted to BHR by BL</td>
                          <td>100%</td>
                          <td>{beData?.Hiring_Quality_Index}</td>
                          <td>{beData?.Hiring_Quality_Index_Score}</td>
                          <td>{ytdData?.Hiring_Quality_Index}</td>
                          <td>{ytdData?.Hiring_Quality_Index_Score}</td>
                        </tr>
                        <tr>
                          <td>5%</td>
                          <td>*% of New Joinees Clearing induction in Pravesh</td>
                          <td>90%</td>
                          <td>{beData?.Induction}</td>
                          <td>{beData?.Induction_Score}</td>
                          <td>{ytdData?.Induction}</td>
                          <td>{ytdData?.Induction_Score}</td>
                        </tr>
                        <tr>
                          <td>5%</td>
                          <td>*Infant attrition rate (within 180 days)</td>
                          <td>20%</td>
                          <td>{beData?.Infant_Attrition_Rate}</td>
                          <td>{beData?.Infant_Attrition_Rate_Score}</td>
                          <td>{ytdData?.Infant_Attrition_Rate}</td>
                          <td>{ytdData?.Infant_Attrition_Rate_Score}</td>
                        </tr>
                        <tr>
                          <td>5%</td>
                          <td>Overall attrition rate (Annual rate in current FY)</td>
                          <td>20%</td>
                          <td>{beData?.Overall_Attrition_Rate}</td>
                          <td>{beData?.Overall_Attrition_Rate_Score}</td>
                          <td>{ytdData?.Overall_Attrition_Rate}</td>
                          <td>{ytdData?.Overall_Attrition_Rate_Score}</td>
                        </tr>
                        <tr className="shade">
                          <td>20%</td>
                          <td><b>Team Building Score</b></td>
                          <td>20%</td>
                          <td>-</td>
                          <td><b>{fmt(totalFTDScore)}</b></td>
                          <td>-</td>
                          <td><b>{fmt(totalYTDScore)}</b></td>
                        </tr>
                      </>
                    ) : (
                      // BE
                      <>
                        <tr>
                          <td>10%</td><td>Calls</td><td>240</td>
                          <td>{beData?.Doctor_Calls}</td><td>{beData?.Calls_Score}</td>
                          <td>{ytdData?.Doctor_Calls}</td><td>{ytdData?.Calls_Score}</td>
                        </tr>
                        <tr>
                          <td>10%</td><td>Coverage %</td><td>95</td>
                          <td>{beData?.Coverage}</td><td>{beData?.Coverage_Score}</td>
                          <td>{ytdData?.Coverage}</td><td>{ytdData?.Coverage_Score}</td>
                        </tr>
                        <tr>
                          <td>10%</td><td>Compliance %</td><td>90</td>
                          <td>{beData?.Compliance}</td><td>{beData?.Compliance_Score}</td>
                          <td>{ytdData?.Compliance}</td><td>{ytdData?.Compliance_Score}</td>
                        </tr>
                        <tr>
                          <td>10%</td><td>RCPA %</td><td>100</td>
                          <td>{beData?.Chemist_Met}</td><td>{beData?.RCPA_Score}</td>
                          <td>{ytdData?.Chemist_Met}</td><td>{ytdData?.RCPA_Score}</td>
                        </tr>
                        <tr>
                          <td>10%</td><td>Activity Implementation %</td><td>100</td>
                          <td>{beData?.Activity_Implementation}</td><td>{beData?.Activity_Implementation_Score}</td>
                          <td>{ytdData?.Activity_Implementation}</td><td>{ytdData?.Activity_Implementation_Score}</td>
                        </tr>
                        <tr className="shade">
                          <td>50%</td><td>Effort Score</td><td>-</td>
                          <td>-</td><td><b>{fmt(totalFTDScore)}</b></td><td>-</td><td><b>{fmt(totalYTDScore)}</b></td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import '../styles.css';

import { useNavigate } from 'react-router-dom';

import { useRole } from './RoleContext';

import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesLeft } from '@fortawesome/free-solid-svg-icons';

import useEncodedTerritory from './hooks/useEncodedTerritory';

const Home = () => {
  const navigate = useNavigate();
  const { decoded, encoded } = useEncodedTerritory();
  
  const { role } = useRole();

  const [beData, setBeData] = useState(null);
  const [ytdData, setYtdData] = useState(null);

  // BM data states
  const [bmBeData, setBmBeData] = useState(null);
  const [bmYtdData, setBmYtdData] = useState(null);

  const [blData, setBlData] = useState(null);
  const [blYtdData, setBlYtdData] = useState(null);

  const fmt = (v) => Number(parseFloat(v || 0)).toFixed(2);

  const HomePage = () => {
    navigate(`/FinalReport?ec=${encoded}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const HeadingWithHome = ({ children }) => {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <h3 style={{ margin: 0, textAlign: "center" }}>{children}</h3>
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
  //          Fetch BE & YTD Data (role-based)
  // ------------------------------------------------
  useEffect(() => {
    if (!decoded) return;

    const loadAll = async () => {
      try {
        NProgress.start();

        if (role === 'BE') {
          // Original BE endpoints
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

          console.log("BE Data fetched:", beJson);
          console.log("YTD Data fetched:", ytdJson);

          if (beRes.ok) setBeData(beJson);
          if (ytdRes.ok) setYtdData(ytdJson);
        }
        else if (role === 'BM') {
          // New BM endpoints
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

          console.log("BM BE Data fetched:", bmBeJson);
          console.log("BM YTD Data fetched:", bmYtdJson);

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
      } catch (err) {
        console.error("API error:", err);
      } finally {
        NProgress.done();
      }
    };

    loadAll();
  }, [decoded, role]);

  // ------------------------------------------------
  //          FINAL YTD TOTAL SCORE - BE
  // ------------------------------------------------
  const totalYTDScore =
    (Number(ytdData?.Secondary_Sales_growth_Score) || 0) +
    (Number(ytdData?.MSR_Achievement_Score) || 0) +
    (Number(ytdData?.RX_Growth_Score) || 0) +
    (Number(ytdData?.Brand_Performance_Index_Score) || 0);

  const totalFTDScore =
    (Number(beData?.Secondary_Sales_growth_Score) || 0) +
    (Number(beData?.MSR_Achievement_Score) || 0) +
    (Number(beData?.RX_Growth_Score) || 0) +
    (Number(beData?.Brand_Performance_Index_Score) || 0);

  // ------------------------------------------------
  //          BM TOTAL FTM & YTD SCORE
  // ------------------------------------------------
  const bmTotalFTMScore =
    (Number(bmBeData?.Target_Achieved_FTM_Score) || 0) +
    (Number(bmBeData?.BPI_FTM_Score) || 0) +
    (Number(bmBeData?.Span_Performance_FTM_Score) || 0) +
    (Number(bmBeData?.RX_Growth_FTM_Score) || 0) +
    (Number(bmBeData?.Viable_Territories_FTM_Score) || 0);

  const bmTotalYTDScore =
    (Number(bmYtdData?.Target_Achieved_YTD_Score) || 0) +
    (Number(bmYtdData?.Brand_Performance_Index_YTD_Score) || 0) +
    (Number(bmYtdData?.Span_of_Performance_YTD_Score) || 0) +
    (Number(bmYtdData?.RX_Growth_YTD_Score) || 0) +
    (Number(bmYtdData?.Viable_Territories_YTD_Score) || 0);

  // ------------------------------------------------
  //          BL TOTAL FTM & YTD SCORE (NEW)
  // ------------------------------------------------
  const blTotalFTMScore =
    (Number(blData?.Target_Achievement_Score) || 0) +
    (Number(blData?.Territories_Achieving_Target_Score) || 0) +
    (Number(blData?.Territories_Achieving_Cat_A_MEP_Score) || 0) +
    (Number(blData?.Category_B_Sales_Vs_Target_Score) || 0) +
    (Number(blData?.Corporate_Drs_Visited_Last_2M_Score) || 0) +
    (Number(blData?.Corporate_Drs_Active_Prescribers_Score) || 0);

  const blTotalYTDScore =
    (Number(blYtdData?.Target_Achievement_Score) || 0) +
    (Number(blYtdData?.Territories_Achieving_Target_Score) || 0) +
    (Number(blYtdData?.Territories_Achieving_Cat_A_MEP_Score) || 0) +
    (Number(blYtdData?.Corporate_Drs_Coverage_Score) || 0) +
    (Number(blYtdData?.Category_B_Sales_Vs_Target_Score) || 0) +
    
    (Number(blYtdData?.Corporate_Drs_Active_Prescribers_Score) || 0);

  return (
    <div>
      <div className="table-box">
        {role === 'BE' && (
          <div className="table-container">
            <div className="efficiency-container">
              <HeadingWithHome>Business Performance</HeadingWithHome>

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
                        <td>20%</td>
                        <td>Secondary Gr%</td>
                        <td>40</td>
                        <td>{beData?.Secondary_Sales_growth_Percent}</td>
                        <td>{beData?.Secondary_Sales_growth_Score}</td>
                        <td>{ytdData?.Secondary_Sales_growth}</td>
                        <td>{ytdData?.Secondary_Sales_growth_Score}</td>
                      </tr>

                      <tr>
                        <td>10%</td>
                        <td>MSR Achievement%</td>
                        <td>100</td>
                        <td>{beData?.MSR_Achievement}</td>
                        <td>{beData?.MSR_Achievement_Score}</td>
                        <td>{ytdData?.MSR_Achievement}</td>
                        <td>{ytdData?.MSR_Achievement_Score}</td>
                      </tr>

                      <tr>
                        <td>10%</td>
                        <td>% Rxer Growth</td>
                        <td>5</td>
                        <td>{beData?.RX_Growth}</td>
                        <td>{beData?.RX_Growth_Score}</td>
                        <td>{ytdData?.RX_Growth}</td>
                        <td>{ytdData?.RX_Growth_Score}</td>
                      </tr>

                      <tr>
                        <td>10%</td>
                        <td>Brand Performance Index</td>
                        <td>100</td>
                        <td>{beData?.Brand_Performance_Index}</td>
                        <td>{beData?.Brand_Performance_Index_Score}</td>
                        <td>{ytdData?.Brand_Performance_Index}</td>
                        <td>{ytdData?.Brand_Performance_Index_Score}</td>
                      </tr>

                      <tr className="shade">
                        <td>50%</td>
                        <td>Performance Score</td>
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

        {role === 'BM' && (
          <div className="table-container">
            <div className="efficiency-container">
              <HeadingWithHome>Business Performance</HeadingWithHome>

              <div className="efficiency-table-container">
                <div className="efficiency-table-scroll">
                  <table className="efficiency-table">
                    <thead>
                      <tr>
                        <th>Weightage</th>
                        <th>Parameter</th>
                        <th>Objective in %</th>
                        <th>Month</th>
                        <th>Month Score</th>
                        <th>YTD</th>
                        <th>YTD Score</th>
                      </tr>
                    </thead>

                    <tbody>
                      <tr>
                        <td>20%</td>
                        <td>Target Ach.</td>
                        <td>100%</td>
                        <td>{bmBeData?.Target_Achieved_FTM}</td>
                        <td>{bmBeData?.Target_Achieved_FTM_Score}</td>
                        <td>{bmYtdData?.Target_Achieved_YTD}</td>
                        <td>{bmYtdData?.Target_Achieved_YTD_Score}</td>
                      </tr>

                      <tr>
                        <td>10%</td>
                        <td>Brand Mix (SP+P+E)</td>
                        <td>100%</td>
                        <td>{bmBeData?.BPI_FTM}</td>
                        <td>{bmBeData?.BPI_FTM_Score}</td>
                        <td>{bmYtdData?.Brand_Performance_Index_YTD}</td>
                        <td>{bmYtdData?.Brand_Performance_Index_YTD_Score}</td>
                      </tr>

                      <tr>
                        <td>10%</td>
                        <td>Span of Performance</td>
                        <td>100%</td>
                        <td>{bmBeData?.Span_Performance_FTM}</td>
                        <td>{bmBeData?.Span_Performance_FTM_Score}</td>
                        <td>{bmYtdData?.Span_of_Performance_YTD}</td>
                        <td>{bmYtdData?.Span_of_Performance_YTD_Score}</td>
                      </tr>

                      <tr>
                        <td>5%</td>
                        <td>% Rxer Growth</td>
                        <td>20%</td>
                        <td>{bmBeData?.RX_Growth_FTM}</td>
                        <td>{bmBeData?.RX_Growth_FTM_Score}</td>
                        <td>{bmYtdData?.RX_Growth_YTD}</td>
                        <td>{bmYtdData?.RX_Growth_YTD_Score}</td>
                      </tr>

                      <tr>
                        <td>5%</td>
                        <td>% of Viable Territories</td>
                        <td>100%</td>
                        <td>{bmBeData?.Viable_Territories_FTM}</td>
                        <td>{bmBeData?.Viable_Territories_FTM_Score}</td>
                        <td>{bmYtdData?.Viable_Territories_YTD}</td>
                        <td>{bmYtdData?.Viable_Territories_YTD_Score}</td>
                      </tr>

                      <tr className="shade">
                        <td>50%</td>
                        <td>Performance Score</td>
                        <td>50%</td>
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

        {role === 'BL' && (
          <div className="table-container">
            <div className="efficiency-container">
              <HeadingWithHome>Business Performance</HeadingWithHome>

              <div className="efficiency-table-container">
                <div className="efficiency-table-scroll">
                  <table className="efficiency-table">
                    <thead>
                      <tr>
                        <th>Weightage</th>
                        <th>Description</th>
                        <th>Objective in %</th>
                        <th>Month</th>
                        <th>Month Score</th>
                        <th>YTD</th>
                        <th>YTD Score</th>
                      </tr>
                    </thead>

                    <tbody>
                      <tr>
                        <td>20%</td>
                        <td>Target Achievement</td>
                        <td>100%</td>
                        <td>{blData?.Target_Achieved}</td>
                        <td>{blData?.Target_Achievement_Score}</td>
                        <td>{blYtdData?.Target_Achieved}</td>
                        <td>{blYtdData?.Target_Achievement_Score}</td>
                      </tr>

                      <tr>
                        <td>5%</td>
                        <td>% of Territories achieving ≥100% of Target</td>
                        <td>90%</td>
                        <td>{blData?.Territories_Achieving_Target}</td>
                        <td>{blData?.Territories_Achieving_Target_Score}</td>
                        <td>{blYtdData?.Territories_Achieving_Target}</td>
                        <td>{blYtdData?.Territories_Achieving_Target_Score}</td>
                      </tr>

                      <tr>
                        <td>5%</td>
                        <td>No of Territories meeting MEP of Category A</td>
                        <td>100%</td>
                        <td>{blData?.Territories_Achieving_Cat_A_MEP}</td>
                        <td>{blData?.Territories_Achieving_Cat_A_MEP_Score}</td>
                        <td>{blYtdData?.Territories_Achieving_Cat_A_MEP}</td>
                        <td>{blYtdData?.Territories_Achieving_Cat_A_MEP_Score}</td>
                      </tr>

                      <tr>
                        <td>5%</td>
                        <td>Category B Target V/s Achievement</td>
                        <td>100%</td>
                        <td>{blData?.Category_B_Sales_Vs_Target}</td>
                        <td>{blData?.Category_B_Sales_Vs_Target_Score}</td>
                        <td>{blYtdData?.Category_B_Sales_Vs_Target}</td>
                        <td>{blYtdData?.Category_B_Sales_Vs_Target_Score}</td>
                      </tr>

                      <tr>
                        <td>2%</td>
                        <td>% of corporate doctors visited in last 2 months (Out of 100 Selected)</td>
                        <td>100%</td>
                        <td>{blData?.Corporate_Drs_Visited_Last_2M}</td>
                        <td>{blData?.Corporate_Drs_Visited_Last_2M_Score}</td>
                        <td>{blYtdData?.Corporate_Drs_Coverage}</td>
                        <td>{blYtdData?.Corporate_Drs_Coverage_Score}</td>
                      </tr>

                      <tr>
                        <td>3%</td>
                        <td>% of Corporate doctors moved to active prescriber category (BL+F)</td>
                        <td>80%</td>
                        <td>{blData?.Corporate_Drs_Active_Prescribers}</td>
                        <td>{blData?.Corporate_Drs_Active_Prescribers_Score}</td>
                        <td>{blYtdData?.Corporate_Drs_Active_Prescribers}</td>
                        <td>{blYtdData?.Corporate_Drs_Active_Prescribers_Score}</td>
                      </tr>

                      <tr className="shade">
                        <td>35%</td>
                        <td>Business Performance Score</td>
                        <td>40%</td>
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
      </div>
    </div>
  );
};

export default Home;

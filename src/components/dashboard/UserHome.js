import React, { useState, useEffect } from 'react';
import '../../styles.css';
import Subnavbar from '../Subnavbar';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { useRole } from '../RoleContext';
import useProfileTerritory from '../hooks/useProfileTerritory';

const UserHome = () => {
  const { userRole, name: empName } = useRole();

  const [beData, setBeData] = useState(null);
  const [ytdData, setYtdData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fmt = (v) => Number(parseFloat(v || 0)).toFixed(2);
  const { profileTerritory } = useProfileTerritory();

  // ---------------------------------------------------------
  // Fetch Data (BE, BM, BL based on userRole)
  // ---------------------------------------------------------
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
        let beUrl = '';
        let ytdUrl = '';

        if (userRole === 'BM') {
          beUrl = 'https://review-backend-bgm.onrender.com/bmDashboardData';
          ytdUrl = 'https://review-backend-bgm.onrender.com/bmDashboardytdData';
        } else if (userRole === 'BE') {
          beUrl = 'https://review-backend-bgm.onrender.com/dashboardData';
          ytdUrl = 'https://review-backend-bgm.onrender.com/dashboardytdData';
        }
        else if (userRole === 'BL') {
          beUrl = 'https://review-backend-bgm.onrender.com/blDashboardData';
          ytdUrl = 'https://review-backend-bgm.onrender.com/blDashboardytdData';
        }
        else {
          setIsLoading(false);
          NProgress.done();
          return;
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

        console.log("UserHome BE/BM/BL Month Data fetched:", beJson);
        console.log("UserHome BE/BM/BL YTD Data fetched:", ytdJson);

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

  // ---------------------------------------------------------
  // Show loader only when actually loading
  // ---------------------------------------------------------
  if (isLoading) {
    return <p style={{ textAlign: "center" }}>Loading...</p>;
  }

  // ---------------------------------------------------------
  // TOTAL SCORES (BE, BM, BL use API data)
  // ---------------------------------------------------------
  let totalYTDScore = 0;
  let totalFTDScore = 0;

  if (userRole === 'BM') {
    totalFTDScore = (
      (Number(beData?.Target_Achieved_FTM_Score) || 0) +
      (Number(beData?.BPI_FTM_Score) || 0) +
      (Number(beData?.Span_Performance_FTM_Score) || 0) +
      (Number(beData?.RX_Growth_FTM_Score) || 0) +
      (Number(beData?.Viable_Territories_FTM_Score) || 0)
    );
    totalYTDScore = (
      (Number(ytdData?.Target_Achieved_YTD_Score) || 0) +
      (Number(ytdData?.Brand_Performance_Index_YTD_Score) || 0) +
      (Number(ytdData?.Span_of_Performance_YTD_Score) || 0) +
      (Number(ytdData?.RX_Growth_YTD_Score) || 0) +
      (Number(ytdData?.Viable_Territories_YTD_Score) || 0)
    );
  } else if (userRole === 'BE') {
    totalYTDScore = (
      Number(ytdData?.Secondary_Sales_growth_Score || 0) +
      Number(ytdData?.MSR_Achievement_Score || 0) +
      Number(ytdData?.RX_Growth_Score || 0) +
      Number(ytdData?.Brand_Performance_Index_Score || 0)
    );
    totalFTDScore = (
      Number(beData?.Secondary_Sales_growth_Score || 0) +
      Number(beData?.MSR_Achievement_Score || 0) +
      Number(beData?.RX_Growth_Score || 0) +
      Number(beData?.Brand_Performance_Index_Score || 0)
    );
  } else if (userRole === 'BL') {
    totalFTDScore = (
      (Number(beData?.Target_Achievement_Score) || 0) +
      (Number(beData?.Territories_Achieving_Target_Score) || 0) +
      (Number(beData?.Territories_Achieving_Cat_A_MEP_Score) || 0) +
      (Number(beData?.Category_B_Sales_Vs_Target_Score) || 0) +
      (Number(beData?.Corporate_Drs_Visited_Last_2M_Score) || 0) +
      (Number(beData?.Corporate_Drs_Active_Prescribers_Score) || 0)
    );
    totalYTDScore = (
      (Number(ytdData?.Target_Achievement_Score) || 0) +
      (Number(ytdData?.Territories_Achieving_Target_Score) || 0) +
      (Number(ytdData?.Territories_Achieving_Cat_A_MEP_Score) || 0) +
      (Number(ytdData?.Category_B_Sales_Vs_Target_Score) || 0) +
      (Number(ytdData?.Corporate_Drs_Active_Prescribers_Score) || 0)
    );
  }

  return (
    <div>
      <div className='table-box'>
        <div className="table-container">
          <div className="efficiency-container">
            {empName && <Subnavbar />}

            <h3 style={{ textAlign: 'center' }}>Business Performance</h3>

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
                    {userRole === 'BM' ? (
                      <>
                        <tr>
                          <td>20%</td><td>Target Ach.</td><td>100%</td>
                          <td>{beData?.Target_Achieved_FTM}</td>
                          <td>{beData?.Target_Achieved_FTM_Score}</td>
                          <td>{ytdData?.Target_Achieved_YTD}</td>
                          <td>{ytdData?.Target_Achieved_YTD_Score}</td>
                        </tr>
                        <tr>
                          <td>10%</td><td>Brand Mix (SP+P+E)</td><td>100%</td>
                          <td>{beData?.BPI_FTM}</td>
                          <td>{beData?.BPI_FTM_Score}</td>
                          <td>{ytdData?.Brand_Performance_Index_YTD}</td>
                          <td>{ytdData?.Brand_Performance_Index_YTD_Score}</td>
                        </tr>
                        <tr>
                          <td>10%</td><td>Span of Performance</td><td>100%</td>
                          <td>{beData?.Span_Performance_FTM}</td>
                          <td>{beData?.Span_Performance_FTM_Score}</td>
                          <td>{ytdData?.Span_of_Performance_YTD}</td>
                          <td>{ytdData?.Span_of_Performance_YTD_Score}</td>
                        </tr>
                        <tr>
                          <td>5%</td><td>RX Growth %</td><td>20%</td>
                          <td>{beData?.RX_Growth_FTM}</td>
                          <td>{beData?.RX_Growth_FTM_Score}</td>
                          <td>{ytdData?.RX_Growth_YTD}</td>
                          <td>{ytdData?.RX_Growth_YTD_Score}</td>
                        </tr>
                        <tr>
                          <td>5%</td><td>% of Viable Territories</td><td>100%</td>
                          <td>{beData?.Viable_Territories_FTM}</td>
                          <td>{beData?.Viable_Territories_FTM_Score}</td>
                          <td>{ytdData?.Viable_Territories_YTD}</td>
                          <td>{ytdData?.Viable_Territories_YTD_Score}</td>
                        </tr>
                        <tr className="shade">
                          <td>50%</td><td>Performance Score</td><td>50.00</td>
                          <td>-</td><td><b>{fmt(totalFTDScore)}</b></td><td>-</td><td><b>{fmt(totalYTDScore)}</b></td>
                        </tr>
                      </>
                    ) : userRole === 'BL' ? (
                      <>
                        <tr>
                          <td>20%</td>
                          <td>Target Achievement</td>
                          <td>100%</td>
                          <td>{beData?.Target_Achieved}</td>
                          <td>{beData?.Target_Achievement_Score}</td>
                          <td>{ytdData?.Target_Achieved}</td>
                          <td>{ytdData?.Target_Achievement_Score}</td>
                        </tr>
                        <tr>
                          <td>5%</td>
                          <td>% of Territories achieving ≥100% of Target</td>
                          <td>90%</td>
                          <td>{beData?.Territories_Achieving_Target}</td>
                          <td>{beData?.Territories_Achieving_Target_Score}</td>
                          <td>{ytdData?.Territories_Achieving_Target}</td>
                          <td>{ytdData?.Territories_Achieving_Target_Score}</td>
                        </tr>
                        <tr>
                          <td>5%</td>
                          <td>No of Territories meeting MEP of Category A</td>
                          <td>100%</td>
                          <td>{beData?.Territories_Achieving_Cat_A_MEP}</td>
                          <td>{beData?.Territories_Achieving_Cat_A_MEP_Score}</td>
                          <td>{ytdData?.Territories_Achieving_Cat_A_MEP}</td>
                          <td>{ytdData?.Territories_Achieving_Cat_A_MEP_Score}</td>
                        </tr>
                        <tr>
                          <td>5%</td>
                          <td>Category B Target V/s Achievement</td>
                          <td>100%</td>
                          <td>{beData?.Category_B_Sales_Vs_Target}</td>
                          <td>{beData?.Category_B_Sales_Vs_Target_Score}</td>
                          <td>{ytdData?.Category_B_Sales_Vs_Target}</td>
                          <td>{ytdData?.Category_B_Sales_Vs_Target_Score}</td>
                        </tr>
                        <tr>
                          <td>2%</td>
                          <td>% of corporate doctors visited in last 2 months (Out of 100 Selected)</td>
                          <td>100%</td>
                          <td>{beData?.Corporate_Drs_Visited_Last_2M}</td>
                          <td>{beData?.Corporate_Drs_Visited_Last_2M_Score}</td>
                          <td>-</td>
                          <td>-</td>
                        </tr>
                        <tr>
                          <td>3%</td>
                          <td>% of Corporate doctors moved to active prescriber category (BL+F)</td>
                          <td>80%</td>
                          <td>{beData?.Corporate_Drs_Active_Prescribers}</td>
                          <td>{beData?.Corporate_Drs_Active_Prescribers_Score}</td>
                          <td>{ytdData?.Corporate_Drs_Active_Prescribers}</td>
                          <td>{ytdData?.Corporate_Drs_Active_Prescribers_Score}</td>
                        </tr>
                        <tr className="shade">
                          <td>35%</td><td>Business Performance Score</td><td>40%</td>
                          <td>-</td><td><b>{fmt(totalFTDScore)}</b></td><td>-</td><td><b>{fmt(totalYTDScore)}</b></td>
                        </tr>
                      </>
                    ) : (
                      // BE/Default
                      <>
                        <tr>
                          <td>20%</td><td>Secondary Gr%</td><td>40</td>
                          <td>{beData?.Secondary_Sales_growth_Percent}</td>
                          <td>{beData?.Secondary_Sales_growth_Score}</td>
                          <td>{ytdData?.Secondary_Sales_growth}</td>
                          <td>{ytdData?.Secondary_Sales_growth_Score}</td>
                        </tr>
                        <tr>
                          <td>10%</td><td>MSR Achievement%</td><td>100</td>
                          <td>{beData?.MSR_Achievement}</td>
                          <td>{beData?.MSR_Achievement_Score}</td>
                          <td>{ytdData?.MSR_Achievement}</td>
                          <td>{ytdData?.MSR_Achievement_Score}</td>
                        </tr>
                        <tr>
                          <td>10%</td><td>% Rxer Growth</td><td>5</td>
                          <td>{beData?.RX_Growth}</td>
                          <td>{beData?.RX_Growth_Score}</td>
                          <td>{ytdData?.RX_Growth}</td>
                          <td>{ytdData?.RX_Growth_Score}</td>
                        </tr>
                        <tr>
                          <td>10%</td><td>Brand Performance Index</td><td>100</td>
                          <td>{beData?.Brand_Performance_Index}</td>
                          <td>{beData?.Brand_Performance_Index_Score}</td>
                          <td>{ytdData?.Brand_Performance_Index}</td>
                          <td>{ytdData?.Brand_Performance_Index_Score}</td>
                        </tr>
                        <tr className="shade">
                          <td>50%</td><td>Performance Score</td><td>50.00</td>
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
};

export default UserHome;

import React, { useState, useEffect } from 'react';
import '../../styles.css';
import { useRole } from '../RoleContext';
import Subnavbar from '../Subnavbar';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import useProfileTerritory from '../hooks/useProfileTerritory';

export default function UserMiscfiles() {
  const { name, userRole } = useRole();
  const { profileTerritory } = useProfileTerritory();

  const [bmBeData, setBmBeData] = useState(null);
  const [bmYtdData, setBmYtdData] = useState(null);
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

        let beUrl = "";
        let ytdUrl = "";

        if (userRole === "BM") {
          beUrl = "https://review-backend-bgm.onrender.com/bmDashboardData";
          ytdUrl = "https://review-backend-bgm.onrender.com/bmDashboardytdData";
        } else if (userRole === "BL") {
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

        console.log("UserMiscfiles BM/BL Month Data:", beJson);
        console.log("UserMiscfiles BM/BL YTD Data:", ytdJson);

        if (beRes.ok) setBmBeData(beJson);
        if (ytdRes.ok) setBmYtdData(ytdJson);
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

  const fmt = (v) => Number(parseFloat(v || 0)).toFixed(2);

  // BM HYGIENE TOTAL SCORES
  const bmHygieneMonthScoreTotal =
    (Number(bmBeData?.Outstanding_FTM_Score) || 0) +
    (Number(bmBeData?.Returns_Percent_FTM_Score) || 0) +
    (Number(bmBeData?.CA_FTM_Score) || 0) +
    (Number(bmBeData?.Closing_FTM_Score) || 0);

  const bmHygieneYTDScoreTotal =
    (Number(bmYtdData?.Returns_Percent_YTD_Score) || 0) +
    (Number(bmYtdData?.CA_Percent_YTD_Score) || 0);

  // BL HYGIENE TOTAL SCORES
  const blHygieneMonthScoreTotal =
    (Number(bmBeData?.Returns_Score) || 0) +
    (Number(bmBeData?.Outstanding_Score) || 0) +
    (Number(bmBeData?.Marketing_Activity_Sales_Score) || 0) +
    (Number(bmBeData?.Closing_Score) || 0);

  const blHygieneYTDScoreTotal =
    (Number(bmYtdData?.Returns_Score) || 0) +
    (Number(bmYtdData?.Marketing_Activity_Sales_Score) || 0);

  return (
    <div>
      <div className="table-box">
        {userRole === 'BM' && (
          <div className="table-container">
            <div className="efficiency-container">
              {name && <Subnavbar />}
              <h3 style={{ textAlign: 'center' }}>Hygiene</h3>

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
                        <td>3%</td>
                        <td>Outstanding Days</td>
                        <td>30</td>
                        <td>{bmBeData?.Outstanding_FTM}</td>
                        <td>{bmBeData?.Outstanding_FTM_Score}</td>
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
                      </tr>
                      <tr>
                        <td>2%</td>
                        <td>% spent of RBO & CA</td>
                        <td>8%</td>
                        <td>{bmBeData?.CA_FTM}</td>
                        <td>{bmBeData?.CA_FTM_Score}</td>
                        <td>{bmYtdData?.CA_Percent_YTD}</td>
                        <td>{bmYtdData?.CA_Percent_YTD_Score}</td>
                      </tr>
                      <tr>
                        <td>2%</td>
                        <td>Closing Days</td>
                        <td>45</td>
                        <td>{bmBeData?.Closing_FTM}</td>
                        <td>{bmBeData?.Closing_FTM_Score}</td>
                        <td>-</td>
                        <td>-</td>
                      </tr>
                      <tr className='shade'>
                        <td>10%</td>
                        <td>Hygiene Score</td>
                        <td>10%</td>
                        <td>-</td>
                        <td><b>{fmt(bmHygieneMonthScoreTotal)}</b></td>
                        <td>-</td>
                        <td><b>{fmt(bmHygieneYTDScoreTotal)}</b></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {userRole === 'BL' && (
          <div className="table-container">
            <div className="efficiency-container">
              {name && <Subnavbar />}
              <h3 style={{ textAlign: 'center' }}>Business Hygiene & Demand Quality</h3>

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
                        <td>% of Returns as % of secondary sales (Objective &lt;2%)</td>
                        <td>2%</td>
                        <td>{bmBeData?.Returns}</td>
                        <td>{bmBeData?.Returns_Score}</td>
                        <td>{bmYtdData?.Returns}</td>
                        <td>{bmYtdData?.Returns_Score}</td>
                      </tr>
                      <tr>
                        <td>4%</td>
                        <td>DSO (days Sales Outstanding) per zone &lt;30</td>
                        <td>30</td>
                        <td>{bmBeData?.Outstanding}</td>
                        <td>{bmBeData?.Outstanding_Score}</td>
                        <td>-</td>
                        <td>-</td>
                      </tr>
                      <tr>
                        <td>10%</td>
                        <td>% business driven by marketing activity</td>
                        <td>70%</td>
                        <td>{bmBeData?.Marketing_Activity_Sales}</td>
                        <td>{bmBeData?.Marketing_Activity_Sales_Score}</td>
                        <td>{bmYtdData?.Marketing_Activity_Sales}</td>
                        <td>{bmYtdData?.Marketing_Activity_Sales_Score}</td>
                      </tr>
                      <tr>
                        <td>3%</td>
                        <td>* Avg. closing stock in days (should be ≤45days)</td>
                        <td>45</td>
                        <td>{bmBeData?.Closing}</td>
                        <td>{bmBeData?.Closing_Score}</td>
                        <td>-</td>
                        <td>-</td>
                      </tr>
                      <tr className='shade'>
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
      </div>
    </div>
  );
}

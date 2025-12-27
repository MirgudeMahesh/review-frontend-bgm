import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar';
// ------------------------Hygine---------------------
import '../../styles.css';
import ActualCommit from '../ActualCommit';
import Textarea from '../Textarea';
import Subnavbar from '../Subnavbar';
import { useRole } from '../RoleContext';
import Chats from './Chats';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import useProfileTerritory from '../hooks/useProfileTerritory';

export default function UserMiscfiles() {
  const userRole = localStorage.getItem("choserole");
  const { role,  name, setName } = useRole();
  const { profileTerritory } = useProfileTerritory();

  const [bmBeData, setBmBeData] = useState(null);
  const [bmYtdData, setBmYtdData] = useState(null);

  const handleSubmit = (text) => {
    console.log("ABC Submitted:", text);
  };

  useEffect(() => {
    if (!profileTerritory) return;
    console.log(userRole)
    if (userRole !== 'BM') return;

    const loadBMHygiene = async () => {
      try {
        NProgress.start();

        const [bmBeRes, bmYtdRes] = await Promise.all([
          fetch("https://review-backend-bgm.onrender.com/bmDashboardData", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ Territory: profileTerritory }),
          }),
          fetch("https://review-backend-bgm.onrender.com/bmDashboardytdData", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ Territory: profileTerritory }),
          }),
        ]);

        const bmBeJson = await bmBeRes.json();
        const bmYtdJson = await bmYtdRes.json();

        console.log("UserMisc BM Hygiene FTM:", bmBeJson);
        console.log("UserMisc BM Hygiene YTD:", bmYtdJson);

        if (bmBeRes.ok) setBmBeData(bmBeJson);
        if (bmYtdRes.ok) setBmYtdData(bmYtdJson);
      } catch (err) {
        console.error("BM Hygiene API error:", err);
      } finally {
        NProgress.done();
      }
    };

    loadBMHygiene();
  }, [profileTerritory, userRole]);

  const fmt = (v) => Number(parseFloat(v || 0)).toFixed(2);

  const bmHygieneMonthScoreTotal =
    (Number(bmBeData?.Outstanding_FTM_Score) || 0) +
    (Number(bmBeData?.Returns_Percent_FTM_Score) || 0) +
    (Number(bmBeData?.CA_FTM_Score) || 0) +
    (Number(bmBeData?.Closing_FTM_Score) || 0);

  const bmHygieneYTDScoreTotal =
    (Number(bmYtdData?.Returns_Percent_YTD_Score) || 0) +
    (Number(bmYtdData?.CA_Percent_YTD_Score) || 0);

  return (
    <div>
      {/* <Navbar />
      {name && <Subnavbar/>} */}
      <div className='table-box'>

        {userRole === 'BM' && (
          <div className="table-container">
            {name && <Subnavbar />}
            <h3 style={{ textAlign: 'center' }}>Hygiene</h3>

            <table className="custom-table">
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>Objective(%)</th>
                  <th>Month</th>
                  <th>Month_Score</th>
                  <th>YTD</th>
                  <th>YTD_Score</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Outstanding Days</td>
                  <td>≤ 21</td>
                  <td>{bmBeData?.Outstanding_FTM}</td>
                  <td>{bmBeData?.Outstanding_FTM_Score}</td>
                  <td>-</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>Returns</td>
                  <td>≤ 2%</td>
                  <td>{bmBeData?.Returns_Percent_FTM}</td>
                  <td>{bmBeData?.Returns_Percent_FTM_Score}</td>
                  <td>{bmYtdData?.Returns_Percent_YTD}</td>
                  <td>{bmYtdData?.Returns_Percent_YTD_Score}</td>
                </tr>
                <tr>
                  <td>RBO/CA</td>
                  <td>&lt;= 8%</td>
                  <td>{bmBeData?.CA_FTM}</td>
                  <td>{bmBeData?.CA_FTM_Score}</td>
                  <td>{bmYtdData?.CA_Percent_YTD}</td>
                  <td>{bmYtdData?.CA_Percent_YTD_Score}</td>
                </tr>
                <tr>
                  <td>Closing Stock</td>
                  <td>≤ 45</td>
                  <td>{bmBeData?.Closing_FTM}</td>
                  <td>{bmBeData?.Closing_FTM_Score}</td>
                  <td>-</td>
                  <td>-</td>
                </tr>
                <tr className='shade'>
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
        )}

        {userRole === 'BL' && (
          <div className="table-container">
            {name && <Subnavbar />}
            <h3 style={{ textAlign: 'center' }}>Business Hygiene & Demand Quality</h3>

            <table className="custom-table" style={{ fontSize: '12px' }}>
              <thead>
                <tr>
                  <th>weightage</th>
                  <th>Parameter</th>
                  <th>Description</th>
                  <th>Objective(%)</th>
                  <th>Month Actual</th>
                  <th>YTD(%)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>88</td>
                  <td>Return Ratio</td>
                  <td>% of Returns as % of secondary sales (Objective 2%) </td>
                  <td>73%</td>
                  <td>88</td><td>88</td>
                </tr>
                <tr>
                  <td>88</td>
                  <td>Outstanding Days</td>
                  <td>DSO (days Sales Outstanding) per zone 30</td>
                  <td>73%</td>
                  <td>88</td><td></td>
                </tr>
                <tr>
                  <td>88</td>
                  <td>Push-to-Pull Ratio</td>
                  <td>% business driven by schemes vs organic sales 30%</td>
                  <td>73%</td>
                  <td>88</td><td>88</td>
                </tr>
                <tr>
                  <td>88</td>
                  <td>Closing Stock Index</td>
                  <td>*Avg. closing stock in days (should be ≤30days)</td>
                  <td>73%</td>
                  <td>88</td><td></td>
                </tr>
                <tr>
                  <td>88</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td><td></td>
                </tr>
                <tr>
                  <td>88</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td><td></td>
                </tr>
                <tr>
                  <td>88</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td><td></td>
                </tr>
                <tr>
                  <td>88</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td><td></td>
                </tr>
                <tr>
                  <td>88</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td><td></td>
                </tr>
                <tr className='shade'>
                  <td></td>
                  <td>Performance Score</td>
                  <td></td>
                  <td>20</td>
                  <td></td><td>88</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';

// ------------------------Hygiene---------------------
import { useLocation, useNavigate } from 'react-router-dom';

import { useRole } from './RoleContext';

import 'nprogress/nprogress.css';
import NProgress from 'nprogress';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotateLeft } from '@fortawesome/free-solid-svg-icons';
import useEncodedTerritory from './hooks/useEncodedTerritory';

export default function Miscfiles() {
  const navigate = useNavigate();
  const location = useLocation();

  const { role, setRole, name, setName } = useRole();

  const { decoded, encoded } = useEncodedTerritory();

  const [bmBeData, setBmBeData] = useState(null);
  const [bmYtdData, setBmYtdData] = useState(null);

  const handleSubmit = (text) => {
    console.log("ABC Submitted:", text);
  };

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
          <FontAwesomeIcon icon={faRotateLeft} size="1x" />
        </button>
      </div>
    );
  };

  // ------------------------------------------------
  //       Fetch BM Hygiene Data (BM only)
  // ------------------------------------------------
  useEffect(() => {
    if (!decoded) return;
    if (role !== 'BM') return;

    const loadBMHygiene = async () => {
      try {
        NProgress.start();

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
      } catch (err) {
        console.error("BM Hygiene API error:", err);
      } finally {
        NProgress.done();
      }
    };

    loadBMHygiene();
  }, [decoded, role]);

  const fmt = (v) => Number(parseFloat(v || 0)).toFixed(2);

  // Sum of Month_Score column (BM hygiene)
  const bmHygieneMonthScoreTotal =
    (Number(bmBeData?.Outstanding_FTM_Score) || 0) +
    (Number(bmBeData?.Returns_Percent_FTM_Score) || 0) +
    (Number(bmBeData?.CA_FTM_Score) || 0) +
    (Number(bmBeData?.Closing_FTM_Score) || 0);

  // Sum of YTD_Score column
  const bmHygieneYTDScoreTotal =
    (Number(bmYtdData?.Returns_Percent_YTD_Score) || 0) +
    (Number(bmYtdData?.CA_Percent_YTD_Score) || 0);

  return (
    <div>
      <div className='table-box'>

        {/* BM view – Hygiene card */}
        {role === 'BM' && (
          <div className="table-container">
            <div className="efficiency-container">
              <HeadingWithHome level="h1">Hygiene</HeadingWithHome>

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

        {/* BL view – old table but wrapped in card for consistency */}
        {role === 'bl' && (
          <div className="table-container">
            <div className="efficiency-container">
              <HeadingWithHome level="h1">
                Business Hygiene &amp; Demand Quality
              </HeadingWithHome>

              <div className="efficiency-table-container">
                <div className="efficiency-table-scroll">
                  <table className="efficiency-table" style={{ fontSize: '12px' }}>
                    <thead>
                      <tr>
                        <th>Weightage</th>
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
                        <td>% of Returns as % of secondary sales (Objective 2%)</td>
                        <td>73%</td>
                        <td>88</td>
                        <td>88</td>
                      </tr>
                      <tr>
                        <td>88</td>
                        <td>Outstanding Days</td>
                        <td>DSO (days Sales Outstanding) per zone 30</td>
                        <td>73%</td>
                        <td>88</td>
                        <td></td>
                      </tr>
                      <tr>
                        <td>88</td>
                        <td>Push-to-Pull Ratio</td>
                        <td>% business driven by schemes vs organic sales 30%</td>
                        <td>73%</td>
                        <td>88</td>
                        <td>88</td>
                      </tr>
                      <tr>
                        <td>88</td>
                        <td>Closing Stock Index</td>
                        <td>*Avg. closing stock in days (should be ≤30days)</td>
                        <td>73%</td>
                        <td>88</td>
                        <td></td>
                      </tr>
                      <tr>
                        <td>88</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                      </tr>
                      <tr>
                        <td>88</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                      </tr>
                      <tr>
                        <td>88</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                      </tr>
                      <tr>
                        <td>88</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                      </tr>
                      <tr>
                        <td>88</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                      </tr>
                      <tr className='shade'>
                        <td></td>
                        <td>Performance Score</td>
                        <td></td>
                        <td>20</td>
                        <td></td>
                        <td>88</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* BH / SBUH view – wrapped similarly */}
        {(role === 'bh' || role === 'sbuh') && (
          <div className="table-container">
            <div className="efficiency-container">
              <HeadingWithHome level="h3">
                Bussiness Hygiene and Demand Quality
              </HeadingWithHome>

              <div className="efficiency-table-container">
                <div className="efficiency-table-scroll">
                  <table className="efficiency-table">
                    <thead>
                      <tr>
                        <th>Parameter</th>
                        <th>Description</th>
                        <th>Objective</th>
                        <th>Month</th>
                        <th>YTD</th>
                        <th>Month Val</th>
                        <th>YTD Val</th>
                        <th>Month</th>
                        <th>YTD</th>
                      </tr>
                    </thead>

                    <tbody>
                      <tr>
                        <td>Return Ratio</td>
                        <td>% of Returns as % of secondary sales (Objective &lt;2%)</td>
                        <td>2%</td>
                        <td>3%</td>
                        <td>28%</td>
                        <td>1.31/51.12</td>
                        <td>7.68/27.43</td>
                        <td>3.91%</td>
                        <td>0.36%</td>
                      </tr>

                      <tr>
                        <td>Outstanding Days</td>
                        <td>DSO (Days Sales Outstanding) &lt;30</td>
                        <td>30</td>
                        <td>17</td>
                        <td></td>
                        <td>15.42/27.19</td>
                        <td></td>
                        <td>5.00%</td>
                        <td>0.00%</td>
                      </tr>

                      <tr>
                        <td>Business generated through MA</td>
                        <td>% business driven by marketing activity</td>
                        <td>70%</td>
                        <td>46%</td>
                        <td>-669%</td>
                        <td>23.75/51.12</td>
                        <td>-183.5/27.43</td>
                        <td>3.32%</td>
                        <td>-47.78%</td>
                      </tr>

                      <tr>
                        <td>Closing Stock Index</td>
                        <td>Avg. closing stock in days (should be &lt;30 days)</td>
                        <td>30</td>
                        <td>42</td>
                        <td></td>
                        <td>42</td>
                        <td></td>
                        <td>3.60%</td>
                        <td>0.00%</td>
                      </tr>

                      <tr className="shade">
                        <td colSpan="2"><b>Performance Score</b></td>
                        <td><b>20%</b></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><b>15.8%</b></td>
                        <td><b>-132.0%</b></td>
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

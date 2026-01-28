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

  const [bmBeData, setBmBeData] = useState(null);
  const [bmYtdData, setBmYtdData] = useState(null);
  const [blData, setBlData] = useState(null);
  const [blYtdData, setBlYtdData] = useState(null);

  const fmt = (v) => Number(parseFloat(v || 0)).toFixed(2);

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
      } catch (err) {
        console.error("API error:", err);
      } finally {
        NProgress.done();
      }
    };

    loadAll();
  }, [decoded, role]);

  // ------------------------------------------------
  // BM HYGIENE TOTAL SCORES
  // ------------------------------------------------
  const bmHygieneMonthScoreTotal =
    (Number(bmBeData?.Outstanding_FTM_Score) || 0) +
    (Number(bmBeData?.Returns_Percent_FTM_Score) || 0) +
    (Number(bmBeData?.CA_FTM_Score) || 0) +
    (Number(bmBeData?.Closing_FTM_Score) || 0);

  const bmHygieneYTDScoreTotal =
    (Number(bmYtdData?.Returns_Percent_YTD_Score) || 0) +
    (Number(bmYtdData?.CA_Percent_YTD_Score) || 0);

  // ------------------------------------------------
  // BL HYGIENE TOTAL SCORES (NEW)
  // ------------------------------------------------
  const blHygieneMonthScoreTotal =
    (Number(blData?.Returns_Score) || 0) +
    (Number(blData?.Outstanding_Score) || 0) +
    (Number(blData?.Marketing_Activity_Sales_Score) || 0) +
    (Number(blData?.Closing_Score) || 0);

  const blHygieneYTDScoreTotal =
    (Number(blYtdData?.Returns_Score) || 0) +
    (Number(blYtdData?.Marketing_Activity_Sales_Score) || 0);

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

        {/* BL view – Hygiene card */}
        {role === "BL" && (
          <div className="table-container">
            <div className="efficiency-container">
              <HeadingWithHome level="h1">
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
                        <td>% of Returns as % of secondary sales (Objective &lt;2%)</td>
                        <td>2%</td>
                        <td>{blData?.Returns}</td>
                        <td>{blData?.Returns_Score}</td>
                        <td>{blYtdData?.Returns}</td>
                        <td>{blYtdData?.Returns_Score}</td>
                      </tr>

                      <tr>
                        <td>4%</td>
                        <td>DSO (days Sales Outstanding) per zone &lt;30</td>
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
                        <td>* Avg. closing stock in days (should be ≤45days)</td>
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

        {/* BH / SBUH view – Static table (no API data needed) */}
        {(role === 'bh' || role === 'sbuh') && (
          <div className="table-container">
            <div className="efficiency-container">
              <HeadingWithHome level="h3">
                Business Hygiene and Demand Quality
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

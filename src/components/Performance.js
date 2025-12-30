import React, { useState, useEffect } from "react";
import Textarea from "./Textarea";
import ActualCommit from "./ActualCommit";
import { useRole } from "./RoleContext";
import Subnavbar from "./Subnavbar";
import { useNavigate, useLocation } from "react-router-dom";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesLeft } from "@fortawesome/free-solid-svg-icons";
import useEncodedTerritory from "./hooks/useEncodedTerritory";
import FinalReport from "./FinalReport";

export default function Performance() {
  const isAuthenticated = useState(!!localStorage.getItem("token"));

  const { role, name } = useRole();
  const location = useLocation();
  const { decoded, encoded } = useEncodedTerritory();
  const navigate = useNavigate();

  const [beData, setBeData] = useState(null);
  const [ytdData, setYtdData] = useState(null);

  // BM data states
  const [bmBeData, setBmBeData] = useState(null);
  const [bmYtdData, setBmYtdData] = useState(null);

  const handleTeamCoverageClick = (metric) => {
    navigate(`/Selection?ec=${encoded}&metric=${metric}`);
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
        } else if (role === "BM") {
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
      } catch (err) {
        console.error("API error:", err);
      } finally {
        NProgress.done();
      }
    };

    loadAll();
  }, [decoded, role]);

  const selection = (metric) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    navigate(`/Selection?ec=${encoded}&metric=${metric}`);
  };

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

  // BM totals (sum of score columns)
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

  const fmt = (v) => Number(parseFloat(v || 0)).toFixed(2);

  return (
    <div>
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
      </div>
    </div>
  );
}





//temporary
{/* <div className="table-box">
        {role === "bm" && (
          <div className="table-container">
            <HeadingWithHome level="h1">Efforts and Effectiveness</HeadingWithHome>

            <table className="custom-table">
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>Objective(%)</th>
                  <th>Month(%)</th>
                  <th>YTD(%)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Self priority customer Cov</td>
                  <td>NA</td>
                  <td><ClickableCell value={beData.Chemist_Calls} metric="Chemist_Calls" /></td>
                  <td>NA</td>
                </tr>
                <tr>
                  <td>Team's Coverage</td>
                  <td>NA</td>
                  <td><ClickableCell value={beData.Coverage} metric="Coverage" /></td>
                  <td>NA</td>
                </tr>
                <tr>
                  <td>Team's compliance</td>
                  <td>NA</td>
                  <td><ClickableCell value={beData.Compliance} metric="Compliance" /></td>
                  <td>NA</td>
                </tr>
                <tr>
                  <td>Mkting Impl(No inv &gt; 30 Days)</td>
                  <td>NA</td>
                  <td><ClickableCell value={beData.Calls} metric="Calls" /></td>
                  <td>NA</td>
                </tr>
                <tr>
                  <td>Coaching days(No of BE X 5)</td>
                  <td>NA</td>
                  <td>NA</td>
                  <td>NA</td>
                </tr>
                <tr>
                  <td>MSP Compliance(Vs OBJ)</td>
                  <td>NA</td>
                  <td>NA</td>
                  <td>NA</td>
                </tr>
                <tr>
                  <td>TP Adherence Self &amp; Team</td>
                  <td>NA</td>
                  <td>NA</td>
                  <td>NA</td>
                </tr>
                <tr>
                  <td>Coaching Score</td>
                  <td>NA</td>
                  <td>NA</td>
                  <td>NA</td>
                </tr>
                <tr>
                  <td>% Tty MSR Compliant(Vs Sec)</td>
                  <td>NA</td>
                  <td>NA</td>
                  <td>NA</td>
                </tr>
                <tr>
                  <td>No of Calls Self</td>
                  <td>NA</td>
                  <td>NA</td>
                  <td>NA</td>
                </tr>
                <tr>
                  <td>Self Learning Score</td>
                  <td>NA</td>
                  <td>NA</td>
                  <td>NA</td>
                </tr>
                <tr>
                  <td>Team Learning Score</td>
                  <td>NA</td>
                  <td>NA</td>
                  <td>NA</td>
                </tr>
                <tr className="shade">
                  <td>Effort Score</td>
                  <td>NA</td>
                  <td>NA</td>
                  <td>NA</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {role === "bl" && (
          <div className="table-container">
            <HeadingWithHome level="h3">Team Building & Development</HeadingWithHome>

            <table className="custom-table">
              <thead>
                <tr>
                  <th>weightage</th>
                  <th>Parameter</th>
                  <th>Description</th>
                  <th>Objective</th>
                  <th>Month Actual</th>
                  <th>YTD</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>15%</td>
                  <td>Hiring Quality Index</td>
                  <td>% of proposed candidates Approved by BHR vs Submitted to BHR by BL</td>
                  <td>100%</td>
                  <td><ClickableCell value={beData.Calls} metric="Calls" /></td>
                  <td>70%</td>
                </tr>
                <tr>
                  <td>0%</td>
                  <td>Induction Score</td>
                  <td>*% of New Joinees Clearing induction in Pravesh</td>
                  <td>100%</td>
                  <td><ClickableCell value={beData.Compliance} metric="Compliance" /></td>
                  <td>70%</td>
                </tr>
                <tr>
                  <td>15%</td>
                  <td>Team Stability Index</td>
                  <td>*Infant attrition rate (within 180 days)</td>
                  <td>100%</td>
                  <td><ClickableCell value={beData.Coverage} metric="Coverage" /></td>
                  <td>70%</td>
                </tr>
                <tr>
                  <td>0%</td>
                  <td>Team Stability Index</td>
                  <td>*Avg. vacancy filling time (in days)</td>
                  <td>100%</td>
                  <td><ClickableCell value={beData.Chemist_Calls} metric="Chemist_Calls" /></td>
                  <td>70%</td>
                </tr>
                <tr>
                  <td>0%</td>
                  <td>Team Stability Index</td>
                  <td>Overall retention rate (Annual rate in current FY)</td>
                  <td>100%</td>
                  <td>33%</td>
                  <td>70%</td>
                </tr>
                <tr>
                  <td>0%</td>
                  <td>Team Development Index</td>
                  <td>*% BM certification level change of L1, L2, L3 (10, 20,30 Points)</td>
                  <td>100%</td>
                  <td>33%</td>
                  <td>70%</td>
                </tr>
                <tr>
                  <td>0%</td>
                  <td>Team Development Index</td>
                  <td>*% BE certification level change of L1, L2, L3 (10, 20,30 Points)</td>
                  <td>100%</td>
                  <td>33%</td>
                  <td>70%</td>
                </tr>
                <tr>
                  <td>0%</td>
                  <td>Talent Pool Strength</td>
                  <td>*No. of pre-assesed internal candidates for promotion</td>
                  <td>100%</td>
                  <td>33%</td>
                  <td>70%</td>
                </tr>
                <tr>
                  <td>0%</td>
                  <td>Talent Pool Strength</td>
                  <td>No of Candedates Data availabale for Vaccancies</td>
                  <td>100%</td>
                  <td>33%</td>
                  <td>70%</td>
                </tr>
                <tr className="shade">
                  <td></td>
                  <td>Team Building Score</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>68%</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {(role === "be") && (
          <div className="table-container">
            {name && <Subnavbar />}

            <HeadingWithHome level="h1">Efforts and Effectiveness</HeadingWithHome>

<table className="custom-table">
  <thead>
    <tr>
      <th>Weightage</th>
      <th>Parameter</th>
      <th>Objective(%)</th>
      <th>Month(%)</th>
      <th>YTD(%)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>10%</td>
      <td># Calls</td>
      <td>240</td>
      <td><ClickableCell value={beData.Calls} metric="Calls" /></td>
      <td>-</td>
    </tr>
    <tr>
      <td>10%</td>
      <td>% Coverage</td>
      <td>95</td>
      <td><ClickableCell value={beData.Coverage} metric="Coverage" /></td>
      <td>-</td>
    </tr>
    <tr>
      <td>10%</td>
      <td>% Compliance</td>
      <td>90</td>
      <td><ClickableCell value={beData.Compliance} metric="Compliance" /></td>
      <td>-</td>
    </tr>
    <tr>
      <td>10%</td>
      <td>% RCPA</td>
      <td>100</td>
      <td><ClickableCell value={beData.Chemist_Calls} metric="Chemist_Calls" /></td>
      <td>-</td>
    </tr>
    <tr>
      <td>10%</td>
      <td>% Activity Imple.</td>
      <td>100</td>
      <td>-</td>
      <td>-</td>
    </tr>
    <tr className="shade">
      <td>50%</td>
      <td>Effort Score</td>
      <td>50.00</td>
      <td>-</td>
      <td>-</td>
    </tr>
  </tbody>
</table>


          </div>
        )}
        {
          (role==='bh' || role==='sbuh') &&(
            <div className="table-container">
                              <HeadingWithHome level="h3">Team Culture and Building</HeadingWithHome>

  <table className="custom-table">
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
        <td>TP Adherence Score</td>
        <td>% adherence to TP</td>
        <td>100%</td>
        <td >43%</td>
        <td >40%</td>
        <td>43.44/100</td>
        <td>39.83/100</td>
        <td>2.17%</td>
        <td>3.98%</td>
      </tr>

      <tr>
        <td>Reporting Integrity Index</td>
        <td>Secondary variance</td>
        <td>10%</td>
        <td >0%</td>
        <td >13%</td>
        <td>0/51.12</td>
        <td>3.6/27.43</td>
        <td>0.00%</td>
        <td>7.61%</td>
      </tr>

      <tr>
        <td>Reviewing Effectiveness</td>
        <td>BL Review Score</td>
        <td>100%</td>
        <td >0%</td>
        <td >0%</td>
        <td>0/0</td>
        <td>0/0</td>
        <td>0.00%</td>
        <td>0.00%</td>
      </tr>

      <tr>
        <td></td>
        <td>BM Review Score</td>
        <td>100%</td>
        <td >0%</td>
        <td >0%</td>
        <td>0/0</td>
        <td>0/0</td>
        <td>0.00%</td>
        <td>0.00%</td>
      </tr>

      <tr>
        <td>MSPR Compliance</td>
        <td>% of headquarters of MSP (for HQ) vs Objective taken cumulatively by BH</td>
        <td>90%</td>
        <td >9%</td>
        <td >35%</td>
        <td>5/54</td>
        <td>19/54</td>
        <td>4.00%</td>
        <td>0.00%</td>
      </tr>

      <tr>
        <td></td>
        <td>% of headquarters having MSP compliance with respect to Average Secondary Sales</td>
        <td>90%</td>
        <td >83%</td>
        <td >98%</td>
        <td>45/54</td>
        <td>53/54</td>
        <td>4.00%</td>
        <td>0.00%</td>
      </tr>

      <tr>
        <td>BE</td>
        <td># of BE Active vs Sanctioned Strength</td>
        <td>100%</td>
        <td >81%</td>
        <td></td>
        <td>44/54</td>
        <td></td>
        <td>4.00%</td>
        <td>0.00%</td>
      </tr>

      <tr>
        <td>BM & BL</td>
        <td># of BM & BL Active vs Sanctioned Strength</td>
        <td>100%</td>
        <td >100%</td>
        <td></td>
        <td>13/13</td>
        <td></td>
        <td>4.00%</td>
        <td>0.00%</td>
      </tr>

      <tr className="shade">
        <td colSpan="2"><b>Team & Culture Building Score</b></td>
        <td><b>25%</b></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td><b>18.17%</b></td>
        <td><b>11.60%</b></td>
      </tr>
    </tbody>
  </table>
</div>

          )
        }
      </div>  */}


//       useEffect(() => {
//   if (role && decoded) {
//     const fetchData = async () => {
//       try {
//         NProgress.start();

//         let response;

//         if (role === "be") {
//           // 👇 Fetch from /sample if role is 'be'
//           response = await fetch("https://review-backend-bgm.onrender.com/dashboardData", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ Territory: decoded }),
//           });

//           const data = await response.json();

//           if (response.ok && data) {
//             setBeData({
//               Chemist_Calls: data.Chemist_Calls || 0,
//               Compliance: data.Compliance || 0,
//               Coverage: data.Coverage || 0,
//               Calls: data.Calls || 0,
//             });
//             console.log("BE Data fetched:", data);
//           }

//         } 
//         else {
//           // 👇 Existing API call for other roles
//           response = await fetch("https://review-backend-bgm.onrender.com/hierarchy-kpi", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ empterr: decoded }),
//           });

//           const data = await response.json();
//           if (response.ok && data[decoded]) {
//             const node = data[decoded];
//             setBeData({
//               Chemist_Calls: node.metrics.Chemist_Calls || 0,
//               Compliance: node.metrics.Compliance || 0,
//               Coverage: node.metrics.Coverage || 0,
//               Calls: node.metrics.Calls || 0,
//             });
//           }
//         }
//       } catch (err) {
//         console.error("API error:", err);
//       } finally {
//         NProgress.done();
//       }
//     };

//     fetchData();
//   }
// }, [role, decoded]);


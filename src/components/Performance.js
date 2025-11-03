import React, { useState, useEffect } from "react";
import Textarea from "./Textarea";
import ActualCommit from "./ActualCommit";
import { useRole } from "./RoleContext";
import Subnavbar from "./Subnavbar";
import { useNavigate } from "react-router-dom";
import NProgress from 'nprogress';
import 'nprogress/nprogress.css'; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from '@fortawesome/free-solid-svg-icons';

export default function Performance() {
  const { role, setRole, name, setName } = useRole();
  const terr = localStorage.getItem("empterr");
  const ec = localStorage.getItem("empByteCode"); 
  const navigate = useNavigate();

 

  const [beData, setBeData] = useState({
    Chemist_Calls: "",
    Compliance: "",
    Coverage: "",
    Calls: "",
  });

useEffect(() => {
  if (role && terr) {
    const fetchData = async () => {
      try {
        NProgress.start();

        let response;

        if (role === "be") {
          // 👇 Fetch from /sample if role is 'be'
          response = await fetch("http://localhost:8000/dashboardData", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ Territory: terr }),
          });

          const data = await response.json();

          if (response.ok && data) {
            setBeData({
              Chemist_Calls: data.Chemist_Calls || 0,
              Compliance: data.Compliance || 0,
              Coverage: data.Coverage || 0,
              Calls: data.Calls || 0,
            });
            console.log("BE Data fetched:", data);
          }

        } else {
          // 👇 Existing API call for other roles
          response = await fetch("http://localhost:8000/hierarchy-kpi", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ empterr: terr }),
          });

          const data = await response.json();
          if (response.ok && data[terr]) {
            const node = data[terr];
            setBeData({
              Chemist_Calls: node.metrics.Chemist_Calls || 0,
              Compliance: node.metrics.Compliance || 0,
              Coverage: node.metrics.Coverage || 0,
              Calls: node.metrics.Calls || 0,
            });
          }
        }
      } catch (err) {
        console.error("API error:", err);
      } finally {
        NProgress.done();
      }
    };

    fetchData();
  }
}, [role, terr]);

  const selection = (metric) => {
    
    window.scrollTo({ top: 0, behavior: "smooth" });
    navigate(`/Selection?ec=${ec}&metric=${metric}`);
   
  };

  const ClickableCell = ({ value, metric }) => (
    <span
      onClick={() => selection(metric)}
      style={{ cursor: "pointer", display: "inline-block" }}
    >
      {value}
    </span>
  );

  const handleSubmit = (text) => {
    console.log("ABC Submitted:", "performance");
  };

  // ✅ Common heading with right-corner Home button
   const HomePage = () => {
   
    navigate(`/FinalReport?ec=${ec}`);
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const HeadingWithHome = ({ level, children }) => {
    const HeadingTag = "h3"
    return (
      <div
        style={{
         display: "flex", justifyContent: "center", alignItems: "center", gap: "10px"
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
          <FontAwesomeIcon icon={faHome} size='2x' />
        </button>
      </div>
    );
  };

  return (
    <div>
      <div className="table-box">
        {/* ---------------- BM TABLE ---------------- */}
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

        {/* ---------------- BL TABLE ---------------- */}
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

        {/* ---------------- BE TABLE ---------------- */}
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
      <td>#N/A</td>
    </tr>
    <tr>
      <td>10%</td>
      <td>% Coverage</td>
      <td>95</td>
      <td><ClickableCell value={beData.Coverage} metric="Coverage" /></td>
      <td>#N/A</td>
    </tr>
    <tr>
      <td>10%</td>
      <td>% Compliance</td>
      <td>90</td>
      <td><ClickableCell value={beData.Compliance} metric="Compliance" /></td>
      <td>#N/A</td>
    </tr>
    <tr>
      <td>10%</td>
      <td>% RCPA</td>
      <td>100</td>
      <td><ClickableCell value={beData.Chemist_Calls} metric="Chemist_Calls" /></td>
      <td>#N/A</td>
    </tr>
    <tr>
      <td>10%</td>
      <td>% Activity Imple.</td>
      <td>100</td>
      <td>#N/A</td>
      <td>#N/A</td>
    </tr>
    <tr className="shade">
      <td>50%</td>
      <td>Effort Score</td>
      <td>50.00</td>
      <td>#N/A</td>
      <td>#N/A</td>
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
      {/* TP Adherence */}
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

      {/* Reporting Integrity */}
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

      {/* Reviewing Effectiveness */}
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

      {/* MSPR Compliance */}
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

      {/* BE */}
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

      {/* BM & BL */}
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

      {/* Footer */}
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
      </div>
      {/* {role && name === '' && <ActualCommit />} */}
    </div>
  );
}

import React, { useState, useEffect } from "react";
import "../../styles.css";
import Textarea from "../Textarea";
import ActualCommit from "../ActualCommit";
import { useRole } from "../RoleContext";
import Subnavbar from "../Subnavbar";
import Chats from "./Chats";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import useProfileTerritory from "../hooks/useProfileTerritory";

export default function UserPerformance() {
  const { profileTerritory } = useProfileTerritory();
  const { name } = useRole();

  const [beData, setBeData] = useState(null);
  const [ytdData, setYtdData] = useState(null);

  useEffect(() => {
    if (!profileTerritory) return;

    const loadAll = async () => {
      try {
        NProgress.start();

        const [beRes, ytdRes] = await Promise.all([
          fetch("https://review-backend-bgm.onrender.com/dashboardData", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ Territory: profileTerritory }),
          }),
          fetch("https://review-backend-bgm.onrender.com/dashboardytdData", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ Territory: profileTerritory }),
          }),
        ]);

        const beJson = await beRes.json();
        const ytdJson = await ytdRes.json();

        if (beRes.ok) setBeData(beJson);
        if (ytdRes.ok) setYtdData(ytdJson);
      } catch (err) {
        console.error("API error:", err);
      } finally {
        NProgress.done();
      }
    };

    loadAll();
  }, [profileTerritory]);

  if (!beData || !ytdData) {
    return <p style={{ textAlign: "center" }}>Loading...</p>;
  }

  // ----------------------------
  // ✅ CALCULATE TOTAL YTD SCORE
  // ----------------------------
 const totalYTDScore = (
  Number(ytdData?.Calls_Score || 0) +
  Number(ytdData?.Coverage_Score || 0) +
  Number(ytdData?.Compliance_Score || 0) +
  Number(ytdData?.RCPA_Score || 0) +
  Number(ytdData?.Activity_Implementation_Score || 0)
).toFixed(2);

const totalFTDScore = (
  (Number(beData?.Calls_Score) || 0) +
  (Number(beData?.Coverage_Score) || 0) +
  (Number(beData?.Compliance_Score) || 0) +
  (Number(beData?.RCPA_Score) || 0) +
  (Number(beData?.Activity_Implementation_Score) || 0)
).toFixed(2);

  return (
    <div>
      <div className="table-box">
        <div className="table-container">
          {name && <Subnavbar />}

          <h3 style={{ textAlign: "center" }}>Efforts and Effectiveness</h3>
 <div className="table-scroll">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Weightage</th>
                <th>Parameter</th>
                <th>Objective</th>
                <th>Month</th>
                <th>Month_Score</th>
                <th>YTD</th>
                <th>YTD_Score</th>
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

              {/* ------------------------- */}
              {/* FINAL ROW WITH YTD TOTAL  */}
              {/* ------------------------- */}
              <tr className="shade">
                <td>50%</td>
                <td>Effort Score</td>
                <td>-</td>
                <td>-</td>
                <td>{totalFTDScore}</td>
                <td>-</td>
                <td><b>{totalYTDScore}</b></td>
              </tr>
            </tbody>
          </table>
          </div>
        </div>
      </div>
    </div>
  );
}
















//   <div
//       className='table-box'
//       >

//         {userRole === 'BM' && (
         

// <div className="table-container">
//   {name && <Subnavbar />}
//   <h3 style={{ textAlign: 'center' }}>Efforts and Effectiveness </h3>
//   <table className="custom-table">
//     <thead>
//       <tr>
//         <th>Parameter</th>
//         <th>Objective(%)</th>
//         <th>Month(%)</th>
//         <th>YTD(%)</th>
//       </tr>
//     </thead>
//     <tbody>
//       <tr>
//         <td>Self priority customer Cov</td>
//         <td>NA</td>
//         <td>{beData.Calls}</td>
//         <td>NA</td>
//       </tr>
//       <tr>
//         <td>Team's Coverage</td>
//         <td>NA</td>
//         <td>{beData.Coverage}</td>
//         <td>NA</td>
//       </tr>
//       <tr>
//         <td>Team's compliance</td>
//         <td>NA</td>
//         <td>{beData.Compliance}</td>
//         <td>NA</td>
//       </tr>
//       <tr>
//         <td>Mkting Impl(No inv &gt; 30 Days)</td>
//         <td>NA</td>
//         <td>NA</td>
//         <td>NA</td>
//       </tr>
//       <tr>
//         <td>Coaching days(No of BE X 5)</td>
//         <td>NA</td>
//         <td>NA</td>
//         <td>NA</td>
//       </tr>
//       <tr>
//         <td>Coaching days(No of BE X 5)</td>
//         <td>NA</td>
//         <td>NA</td>
//         <td>NA</td>
//       </tr>
//       <tr>
//         <td>MSP Compliance(Vs OBJ)</td>
//         <td>NA</td>
//         <td>NA</td>
//         <td>NA</td>
//       </tr>
//       <tr>
//         <td>TP Adherence Self & Team</td>
//         <td>NA</td>
//         <td>NA</td>
//         <td>NA</td>
//       </tr>
//       <tr>
//         <td>Coaching Score</td>
//         <td>NA</td>
//         <td>NA</td>
//         <td>NA</td>
//       </tr>
//       <tr>
//         <td>% Tty MSR Compliant(Vs Sec)</td>
//         <td>NA</td>
//         <td>NA</td>
//         <td>NA</td>
//       </tr>
//       <tr>
//         <td>No of Calls Self</td>
//         <td>NA</td>
//         <td>NA</td>
//         <td>NA</td>
//       </tr>
//       <tr>
//         <td>Self Learning Score</td>
//         <td>NA</td>
//         <td>NA</td>
//         <td>NA</td>
//       </tr>
//       <tr>
//         <td>Team Learning Score</td>
//         <td>NA</td>
//         <td>NA</td>
//         <td>NA</td>
//       </tr>
//       <tr className='shade'>
//         <td>Effort Score</td>
//         <td>NA</td>
//         <td>NA</td>
//         <td>NA</td>
//       </tr>
//     </tbody>
//   </table>
// </div>


      

//         )}
//         {userRole === 'BL' && (
        

//             <div className="table-container">
//                {name && <Subnavbar/>}
//               <h3 style={{ textAlign: 'center' }}>Team Building & Development</h3>

//               <table className="custom-table">
//                 <thead>
//                   <tr>
//                     <th>weightage</th>
//                     <th>Parameter</th>
//                     <th>Description</th>
//                     <th>Objective</th>
//                     <th>Month Actual</th>
//                     <th>YTD</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   <tr>
//                     <td>15%</td> {/* ✅ Show role here */}
//                     <td>Hiring Quality Index</td>
//                     <td>% of proposed candidates Approved by BHR vs Submitted to BHR by BL</td>
//                     <td>100%</td>
//                     <td>33%</td>
//                     <td>70%</td>
//                   </tr>
//                   <tr>
//                     <td>0%</td> {/* ✅ Show role here */}
//                     <td>Induction Score</td>
//                     <td>*% of New Joinees Clearing induction in Pravesh</td>
//                     <td>100%</td>
//                     <td>33%</td>
//                     <td>70%</td>
//                   </tr>
//                   <tr>
//                     <td>15%</td> {/* ✅ Show role here */}
//                     <td>Team Stability IndexI</td>
//                     <td>*Infant attrition rate (within 180 days)</td>
//                     <td>100%</td>
//                     <td>33%</td>
//                     <td>70%</td>
//                   </tr>
//                   <tr>
//                     <td>0%</td> {/* ✅ Show role here */}
//                     <td>Team Stability IndexI</td>
//                     <td>*Avg. vacancy filling time (in days)</td>
//                     <td>100%</td>
//                     <td>33%</td>
//                     <td>70%</td>
//                   </tr>
//                   <tr>
//                     <td>0%</td> {/* ✅ Show role here */}
//                     <td>Team Stability IndexI</td>
//                     <td>Overall retention rate (Annual rate in current FY)</td>
//                     <td>100%</td>
//                     <td>33%</td>
//                     <td>70%</td>
//                   </tr>
//                   <tr>
//                     <td>0%</td> {/* ✅ Show role here */}
//                     <td>Team Development Index</td>
//                     <td>*% BM certification level change of L1, L2, L3 (10, 20,30 Points)</td>
//                     <td>100%</td>
//                     <td>33%</td>
//                     <td>70%</td>
//                   </tr>
//                   <tr>
//                     <td>0%</td> {/* ✅ Show role here */}
//                     <td>Team Development Index</td>
//                     <td>*% BE certification level change of L1, L2, L3 (10, 20,30 Points)</td>
//                     <td>100%</td>
//                     <td>33%</td>
//                     <td>70%</td>
//                   </tr>
//                   <tr>
//                     <td>0%</td> {/* ✅ Show role here */}
//                     <td>Talent Pool Strength</td>
//                     <td>*No. of pre-assesed internal candidates for promotion</td>
//                     <td>100%</td>
//                     <td>33%</td>
//                     <td>70%</td>
//                   </tr>
//                   <tr>
//                     <td>0%</td> {/* ✅ Show role here */}
//                     <td>Talent Pool Strength</td>
//                     <td>No of Candedates Data availabale for Vaccancies</td>
//                     <td>100%</td>
//                     <td>33%</td>
//                     <td>70%</td>
//                   </tr>
//                   <tr className='shade'>
//                     <td></td>
//                     <td>Team Building Score</td>
//                     <td></td><td></td>
//                     <td></td>


//                     <td>68%</td>
//                   </tr>
//                 </tbody>
//               </table>
//              </div>

        

//         )}

// {(userRole === "BE" || userRole==='TE')&& (
//  <div className="table-container">
//   {name && <Subnavbar />}
//   <h3 style={{ textAlign: "center" }}>Efforts and Effectiveness </h3>
//   <table className="custom-table">
//     <thead>
//       <tr>
//         <th>Parameter</th>
//         <th>Objective(%)</th>
//         <th>Month(%)</th>
//         <th>YTD(%)</th>
//       </tr>
//     </thead>
//     <tbody>
//       <tr>
//         <td>Calls</td>
//         <td>NA</td>
//         <td>{beData.Calls}</td>
//         <td>NA</td>
//       </tr>
//       <tr>
//         <td>Coverage</td>
//         <td>NA</td>
//         <td>{beData.Coverage}</td>
//         <td>NA</td>
//       </tr>
//       <tr>
//         <td>Compliance</td>
//         <td>NA</td>
//         <td>{beData.Compliance}</td>
//         <td>NA</td>
//       </tr>
//       <tr>
//         <td>Chemist_Calls</td>
//         <td>NA</td>
//         <td>{beData.Chemist_Calls}</td>
//         <td>NA</td>
//       </tr>
//       <tr className="shade">
//         <td>Effort Score</td>
//         <td>NA</td>
//         <td>NA</td>
//         <td>NA</td>
//       </tr>
//     </tbody>
//   </table>
// </div>

// )}


//       </div>
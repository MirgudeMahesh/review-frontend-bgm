import React from 'react'

import '../../styles.css';
import { useState, useEffect } from 'react';
import Chats from './Chats';
import Navbar from '../Navbar';
import Subnavbar from '../Subnavbar';
import ActualCommit from '../ActualCommit';
import NProgress from 'nprogress';
import { useRole } from '../RoleContext';
import Textarea from '../Textarea';
import useProfileTerritory from '../hooks/useProfileTerritory';

const UserHome = () => {

  const { role, userRole, name, setName } = useRole();
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));

  const [beData, setBeData] = useState(null);
  const [ytdData, setYtdData] = useState(null);

  const fmt = (v) => Number(parseFloat(v || 0)).toFixed(2); // <-- 1 DECIMAL FORMAT

  const { profileTerritory } = useProfileTerritory();

  // ---------------------------------------------------------
  // Fetch Data
  // ---------------------------------------------------------
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

        console.log("BE Data fetched:", beJson);
        console.log("YTD Data fetched:", ytdJson);

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

  // ---------------------------------------------------------
  // Show loader
  // ---------------------------------------------------------
  if (!beData || !ytdData) {
    return <p style={{ textAlign: "center" }}>Loading...</p>;
  }

  // ---------------------------------------------------------
  // TOTAL YTD SCORE (SUM OF ALL SCORES)
  // ---------------------------------------------------------
 const totalYTDScore = (
  Number(ytdData?.Secondary_Sales_growth_Score) +
  Number(ytdData?.MSR_Achievement_Score) +
  Number(ytdData?.RX_Growth_Score) +
  Number(ytdData?.Brand_Performance_Index_Score)
).toFixed(2);

const totalFTDScore = (
  Number(beData?.Secondary_Sales_growth_Score) +
  Number(beData?.MSR_Achievement_Score) +
  Number(beData?.RX_Growth_Score) +
  Number(beData?.Brand_Performance_Index_Score)
).toFixed(2);

  return (
    <div>
      <div className='table-box'>
        <div className="table-container">

          {name && <Subnavbar />}

          <h3 style={{ textAlign: 'center' }}>Bussiness Performance</h3>

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
    <td>RX Growth %</td>
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

  {/* FINAL ROW */}
  <tr className="shade">
    <td>50%</td>
    <td>Performance Score</td>
    <td>50.00</td>
    <td>-</td>
    <td><b>{fmt(totalFTDScore)}</b></td>
    <td>-</td>

    {/* FINAL YTD TOTAL SCORE */}
    <td><b>{fmt(totalYTDScore)}</b></td>
  </tr>
</tbody>

          </table>

        </div>
      </div>
    </div>
  )
}

export default UserHome;







//  <div
//         className='table-box'
//       >

//         {userRole === 'BM' && (
         


//             <div className="table-container">
//                 {name && <Subnavbar/>}
//               <h3 style={{ textAlign: 'center' }}>Bussiness Performance</h3>
//               <table className="custom-table">
//                 <thead>
//                   <tr>
//                     <th>Parameter</th>
//                     <th>Objective(%)</th>
//                     <th>Month(%)</th>
//                     <th>YTD(%)</th>
//                   </tr>
//                 </thead>
//               <tbody>
//   <tr>
//     <td>Target Ach</td>
//     <td>100%</td>
//     <td>45</td>
//     <td>88</td>
//   </tr>
//   <tr>
//     <td>Secondary Gr%</td>
//     <td>22</td>
//     <td>77</td>
//     <td>75</td>
//   </tr>
//   <tr>
//     <td>Span of Performance</td>
//     <td>23</td>
//     <td>12</td>
//     <td>92</td>
//   </tr>
//   <tr>
//     <td>Dr.Conversion(Self Prio)</td>
//     <td>20</td>
//     <td>64</td>
//     <td>81</td>
//   </tr>
//   <tr>
//     <td>%Gr in Rxer</td>
//     <td>24</td>
//     <td>31</td>
//     <td>68</td>
//   </tr>
//   <tr>
//     <td>% of Viable Terr</td>
//     <td>24</td>
//     <td>89</td>
//     <td>68</td>
//   </tr>
//   <tr className="shade">
//     <td>Performance Score</td>
//     <td>24</td>
//     <td>56</td>
//     <td>68</td>
//   </tr>
// </tbody>

//               </table>
                


//           </div>

//         )}

//         {userRole === 'BL' && (



//           <div className="table-container">
//              {name && <Subnavbar/>}
//             <h3 style={{ textAlign: 'center' }}>Bussiness Performance</h3>
//             <table className="custom-table">
//               <thead>
//                 <tr>
//                   <th>weightage</th>
//                   <th>Parameter</th>
//                   <th>Description</th> <th>Objective(%)</th>
//                   <th>Month Actual(%)</th>
//                   <th>YTD(%)</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 <tr>
//                   <td>10%</td>
//                   <td>Target / Objective Realization</td>
//                   <td>Target achieved ≥100%</td>
//                   <td>88</td><td>88</td><td>88</td>
//                 </tr>
//                 <tr>
//                   <td>10%</td>
//                   <td>Target / Objective Realization</td>
//                   <td> % of Territories achieving ≥90% of Objective</td>
//                   <td>88</td><td>88</td><td>88</td>
//                 </tr>
//                 <tr>
//                   <td>10%</td>
//                   <td>Corporate Customer Engagement & Conversion Score</td>
//                   <td> % of corporate doctors visited/month (Out of 100 Selected)</td>
//                   <td>88</td><td>88</td><td>88</td>
//                 </tr>
//                 <tr>
//                   <td>10%</td>
//                   <td>Corporate Customer Engagement & Conversion Score</td>
//                   <td> % of Corporate doctors moved to active prescriber category </td>
//                   <td>88</td><td>88</td><td>88</td>
//                 </tr>
//                 <tr>
//                   <td>68</td>
//                   <td></td>
//                   <td></td>
//                   <td></td>
//                   <td></td>
//                   <td>68</td>
//                 </tr>
//                 <tr>
//                   <td></td>
//                   <td></td>
//                   <td></td>
//                   <td></td>
//                   <td></td>
//                   <td></td>
//                 </tr>
//                 <tr>
//                   <td></td>
//                   <td></td>
//                   <td></td>
//                   <td></td>
//                   <td></td>
//                   <td></td>
//                 </tr>
//                 <tr>
//                   <td></td>
//                   <td></td>
//                   <td></td>
//                   <td></td>
//                   <td></td>
//                   <td></td>
//                 </tr>
//                 <tr>
//                   <td></td>
//                   <td></td>
//                   <td></td>
//                   <td></td>
//                   <td></td>
//                   <td></td>
//                 </tr>
//                 <td></td>
//                 <tr className='shade'>
//                   <td></td>
//                   <td>Performance Score</td>
//                   <td>24</td>
//                   <td></td>
//                   <td></td>
//                   <td>68</td>
//                 </tr>
//               </tbody>
//             </table>
//        </div>



//         )}

//         {(userRole === 'BE'  || userRole ==='TE')&& (
         


//             <div className="table-container">
//                 {name && <Subnavbar/>}
//               <h3 style={{ textAlign: 'center' }}>Bussiness Performance</h3>
//               <table className="custom-table">
//                 <thead>
//                   <tr>
//                     <th>Parameter</th>
//                     <th>Objective(%)</th>
//                     <th>Month(%)</th>
//                     <th>YTD(%)</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   <tr>
//                     <td>Secondary Gr%</td>
//                     <td>-</td>
//                     <td>-</td>
//                     <td>-</td>
//                   </tr>
//                   <tr>
//                     <td>MSR Acheivement%</td>
//                     <td>100</td>
//                     <td>-</td>
//                     <td>-</td>
//                   </tr>
//                   <tr>
//                     <td>%Gr in Rxer</td>
//                     <td>5</td>
//                     <td>-</td>
//                     <td>-</td>
//                   </tr>
//                   <tr>
//                     <td>Brand Perf. Index</td>
//                     <td>100</td>
//                     <td>-</td>
//                     <td>-</td>
//                   </tr>

//                   <tr className='shade'>
//                     <td>Performance Score</td>
//                     <td>24</td>
//                     <td>-</td>
//                     <td>68</td>
//                   </tr>
//                 </tbody>
//               </table>
      

//           </div>

//         )}



//       </div>

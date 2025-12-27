import React from 'react';

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
  const userole = localStorage.getItem('choserole'); // 'BE' or 'BM'
  const { role, userRole, name, setName } = useRole();
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));

  const [beData, setBeData] = useState(null);
  const [ytdData, setYtdData] = useState(null);

  const fmt = (v) => Number(parseFloat(v || 0)).toFixed(2); // <-- 1 DECIMAL FORMAT

  const { profileTerritory } = useProfileTerritory();

  // ---------------------------------------------------------
  // Fetch Data (BE or BM based on userole)
  // ---------------------------------------------------------
  useEffect(() => {
    if (!profileTerritory) return;

    const loadAll = async () => {
      try {
        NProgress.start();

        let beUrl = '';
        let ytdUrl = '';

        if (userole === 'BM') {
          beUrl = 'https://review-backend-bgm.onrender.com/bmDashboardData';
          ytdUrl = 'https://review-backend-bgm.onrender.com/bmDashboardytdData';
        } else {
          // default BE
          beUrl = 'https://review-backend-bgm.onrender.com/dashboardData';
          ytdUrl = 'https://review-backend-bgm.onrender.com/dashboardytdData';
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

        console.log("UserHome BE/BM Month Data fetched:", beJson);
        console.log("UserHome BE/BM YTD Data fetched:", ytdJson);

        if (beRes.ok) setBeData(beJson);
        if (ytdRes.ok) setYtdData(ytdJson);
      } catch (err) {
        console.error("API error:", err);
      } finally {
        NProgress.done();
      }
    };

    loadAll();
  }, [profileTerritory, userole]);

  // ---------------------------------------------------------
  // Show loader
  // ---------------------------------------------------------
  if (!beData || !ytdData) {
    return <p style={{ textAlign: "center" }}>Loading...</p>;
  }

  // ---------------------------------------------------------
  // TOTAL SCORES (BE and BM use their own fields)
  // ---------------------------------------------------------
  let totalYTDScore = 0;
  let totalFTDScore = 0;

  if (userole === 'BM') {
    // BM Business Performance totals
    totalFTDScore = (
      (Number(beData?.Target_Achieved_FTM_Score) || 0) +
      (Number(beData?.BPI_FTM_Score) || 0) +
      (Number(beData?.Span_Performance_FTM_Score) || 0) +
      (Number(beData?.RX_Growth_FTM_Score) || 0) +
      (Number(beData?.Viable_Territories_FTM_Score) || 0)
    ).toFixed(2);

    totalYTDScore = (
      (Number(ytdData?.Target_Achieved_YTD_Score) || 0) +
      (Number(ytdData?.Brand_Performance_Index_YTD_Score) || 0) +
      (Number(ytdData?.Span_of_Performance_YTD_Score) || 0) +
      (Number(ytdData?.RX_Growth_YTD_Score) || 0) +
      (Number(ytdData?.Viable_Territories_YTD_Score) || 0)
    ).toFixed(2);
  } else {
    // BE totals (original)
    totalYTDScore = (
      Number(ytdData?.Secondary_Sales_growth_Score) +
      Number(ytdData?.MSR_Achievement_Score) +
      Number(ytdData?.RX_Growth_Score) +
      Number(ytdData?.Brand_Performance_Index_Score)
    ).toFixed(2);

    totalFTDScore = (
      Number(beData?.Secondary_Sales_growth_Score) +
      Number(beData?.MSR_Achievement_Score) +
      Number(beData?.RX_Growth_Score) +
      Number(beData?.Brand_Performance_Index_Score)
    ).toFixed(2);
  }

  return (
    <div>
      <div className='table-box'>
        <div className="table-container">

          {name && <Subnavbar />}

          <h3 style={{ textAlign: 'center' }}>Business Performance</h3>
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
                {userole === 'BM' ? (
                  <>
                    <tr>
                      <td>20%</td>
                      <td>Target Ach.</td>
                      <td>100%</td>
                      <td>{beData?.Target_Achieved_FTM}</td>
                      <td>{beData?.Target_Achieved_FTM_Score}</td>
                      <td>{ytdData?.Target_Achieved_YTD}</td>
                      <td>{ytdData?.Target_Achieved_YTD_Score}</td>
                    </tr>

                    <tr>
                      <td>10%</td>
                      <td>Brand Mix (SP+P+E)</td>
                      <td>100%</td>
                      <td>{beData?.BPI_FTM}</td>
                      <td>{beData?.BPI_FTM_Score}</td>
                      <td>{ytdData?.Brand_Performance_Index_YTD}</td>
                      <td>{ytdData?.Brand_Performance_Index_YTD_Score}</td>
                    </tr>

                    <tr>
                      <td>10%</td>
                      <td>Span of Performance</td>
                      <td>100%</td>
                      <td>{beData?.Span_Performance_FTM}</td>
                      <td>{beData?.Span_Performance_FTM_Score}</td>
                      <td>{ytdData?.Span_of_Performance_YTD}</td>
                      <td>{ytdData?.Span_of_Performance_YTD_Score}</td>
                    </tr>

                    <tr>
                      <td>5%</td>
                      <td>% Gr in Rxer</td>
                      <td>20%</td>
                      <td>{beData?.RX_Growth_FTM}</td>
                      <td>{beData?.RX_Growth_FTM_Score}</td>
                      <td>{ytdData?.RX_Growth_YTD}</td>
                      <td>{ytdData?.RX_Growth_YTD_Score}</td>
                    </tr>

                    <tr>
                      <td>5%</td>
                      <td>% of Viable Tty</td>
                      <td>100%</td>
                      <td>{beData?.Viable_Territories_FTM}</td>
                      <td>{beData?.Viable_Territories_FTM_Score}</td>
                      <td>{ytdData?.Viable_Territories_YTD}</td>
                      <td>{ytdData?.Viable_Territories_YTD_Score}</td>
                    </tr>

                    <tr className="shade">
                      <td>50%</td>
                      <td>Performance Score</td>
                      <td>50.00</td>
                      <td>-</td>
                      <td><b>{fmt(totalFTDScore)}</b></td>
                      <td>-</td>
                      <td><b>{fmt(totalYTDScore)}</b></td>
                    </tr>
                  </>
                ) : (
                  <>
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

                    <tr className="shade">
                      <td>50%</td>
                      <td>Performance Score</td>
                      <td>50.00</td>
                      <td>-</td>
                      <td><b>{fmt(totalFTDScore)}</b></td>
                      <td>-</td>
                      <td><b>{fmt(totalYTDScore)}</b></td>
                    </tr>
                  </>
                )}
              </tbody>

            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

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

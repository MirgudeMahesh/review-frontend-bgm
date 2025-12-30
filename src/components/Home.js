import React, { useState, useEffect } from 'react';
import '../styles.css';

import { useLocation, useNavigate } from 'react-router-dom';

import Navbar from './Navbar';
import Subnavbar from './Subnavbar';
import ActualCommit from './ActualCommit';
import { useRole } from './RoleContext';
import Textarea from './Textarea';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesLeft} from '@fortawesome/free-solid-svg-icons';

import useEncodedTerritory from './hooks/useEncodedTerritory';

const Home = () => {
  const navigate = useNavigate();
  const { decoded, encoded } = useEncodedTerritory();
  const location = useLocation();
  const { role } = useRole();

  const [beData, setBeData] = useState(null);
  const [ytdData, setYtdData] = useState(null);

  // BM data states
  const [bmBeData, setBmBeData] = useState(null);
  const [bmYtdData, setBmYtdData] = useState(null);

  const fmt = (v) => Number(parseFloat(v || 0)).toFixed(2);

  const HomePage = () => {
    navigate(`/FinalReport?ec=${encoded}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const HeadingWithHome = ({ children }) => {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <h3 style={{ margin: 0, textAlign: "center" }}>{children}</h3>
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

  // ------------------------------------------------
  //          Fetch BE & YTD Data (role-based)
  // ------------------------------------------------
  useEffect(() => {
    if (!decoded) return;

   

    const loadAll = async () => {
      try {
        NProgress.start();

        if (role === 'BE') {
          // Original BE endpoints
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

          console.log("BE Data fetched:", beJson);
          console.log("YTD Data fetched:", ytdJson);

          if (beRes.ok) setBeData(beJson);
          if (ytdRes.ok) setYtdData(ytdJson);
        } else if (role === 'BM') {
          // New BM endpoints
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

          console.log("BM BE Data fetched:", bmBeJson);
          console.log("BM YTD Data fetched:", bmYtdJson);

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
  }, [decoded]);

 

  // ------------------------------------------------
  //          FINAL YTD TOTAL SCORE - BE
  // ------------------------------------------------
  const totalYTDScore =
    (Number(ytdData?.Secondary_Sales_growth_Score) || 0) +
    (Number(ytdData?.MSR_Achievement_Score) || 0) +
    (Number(ytdData?.RX_Growth_Score) || 0) +
    (Number(ytdData?.Brand_Performance_Index_Score) || 0);

  const totalFTDScore =
    (Number(beData?.Secondary_Sales_growth_Score) || 0) +
    (Number(beData?.MSR_Achievement_Score) || 0) +
    (Number(beData?.RX_Growth_Score) || 0) +
    (Number(beData?.Brand_Performance_Index_Score) || 0);

  // ------------------------------------------------
  //          BM TOTAL FTM & YTD SCORE
  // ------------------------------------------------
  const bmTotalFTMScore =
    (Number(bmBeData?.Target_Achieved_FTM_Score) || 0) +
    (Number(bmBeData?.BPI_FTM_Score) || 0) +
    (Number(bmBeData?.Span_Performance_FTM_Score) || 0) +
    (Number(bmBeData?.RX_Growth_FTM_Score) || 0) +
    (Number(bmBeData?.Viable_Territories_FTM_Score) || 0);

  const bmTotalYTDScore =
    (Number(bmYtdData?.Target_Achieved_YTD_Score) || 0) +
    (Number(bmYtdData?.Brand_Performance_Index_YTD_Score) || 0) +
    (Number(bmYtdData?.Span_of_Performance_YTD_Score) || 0) +
    (Number(bmYtdData?.RX_Growth_YTD_Score) || 0) +
    (Number(bmYtdData?.Viable_Territories_YTD_Score) || 0);

  return (
    <div>
      <div className="table-box">
        {role === 'BE' && (
          <div className="table-container">
            <div className="efficiency-container">
              <HeadingWithHome>Business Performance</HeadingWithHome>

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
                        <td>% Rxer Growth</td>
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

        {role === 'BM' && (
          <div className="table-container">
            <div className="efficiency-container">
              <HeadingWithHome>Business Performance</HeadingWithHome>

              <div className="efficiency-table-container">
                <div className="efficiency-table-scroll">
                  <table className="efficiency-table">
                    <thead>
                      <tr>
                        <th>Weightage</th>
                        <th>Parameter</th>
                        <th>Objective in %</th>
                        <th>Month</th>
                        <th>Month Score</th>
                        <th>YTD</th>
                        <th>YTD Score</th>
                      </tr>
                    </thead>

                    <tbody>
                      <tr>
                        <td>20%</td>
                        <td>Target Ach.</td>
                        <td>100%</td>
                        <td>{bmBeData?.Target_Achieved_FTM}</td>
                        <td>{bmBeData?.Target_Achieved_FTM_Score}</td>
                        <td>{bmYtdData?.Target_Achieved_YTD}</td>
                        <td>{bmYtdData?.Target_Achieved_YTD_Score}</td>
                      </tr>

                      <tr>
                        <td>10%</td>
                        <td>Brand Mix (SP+P+E)</td>
                        <td>100%</td>
                        <td>{bmBeData?.BPI_FTM}</td>
                        <td>{bmBeData?.BPI_FTM_Score}</td>
                        <td>{bmYtdData?.Brand_Performance_Index_YTD}</td>
                        <td>{bmYtdData?.Brand_Performance_Index_YTD_Score}</td>
                      </tr>

                      <tr>
                        <td>10%</td>
                        <td>Span of Performance</td>
                        <td>100%</td>
                        <td>{bmBeData?.Span_Performance_FTM}</td>
                        <td>{bmBeData?.Span_Performance_FTM_Score}</td>
                        <td>{bmYtdData?.Span_of_Performance_YTD}</td>
                        <td>{bmYtdData?.Span_of_Performance_YTD_Score}</td>
                      </tr>

                      <tr>
                        <td>5%</td>
                        <td>% Rxer Growth</td>
                        <td>20%</td>
                        <td>{bmBeData?.RX_Growth_FTM}</td>
                        <td>{bmBeData?.RX_Growth_FTM_Score}</td>
                        <td>{bmYtdData?.RX_Growth_YTD}</td>
                        <td>{bmYtdData?.RX_Growth_YTD_Score}</td>
                      </tr>

                      <tr>
                        <td>5%</td>
                        <td>% of Viable Territories</td>
                        <td>100%</td>
                        <td>{bmBeData?.Viable_Territories_FTM}</td>
                        <td>{bmBeData?.Viable_Territories_FTM_Score}</td>
                        <td>{bmYtdData?.Viable_Territories_YTD}</td>
                        <td>{bmYtdData?.Viable_Territories_YTD_Score}</td>
                      </tr>

                      <tr className="shade">
                        <td>50%</td>
                        <td>Performance Score</td>
                        <td>50%</td>
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
};

export default Home;







//temporary



// <div

//         className='table-box'

//       >



//         {role === 'bm' && (

         





//             <div className="table-container">

               

//                             <HeadingWithHome level="h1">Bussiness Performance</HeadingWithHome>



//               <table className="custom-table">

//   <thead>

//     <tr>

//       <th>Parameter</th>

//       <th>Objective(%)</th>

//       <th>Month(%)</th>

//       <th>YTD(%)</th>

//     </tr>

//   </thead>

//   <tbody>

//     <tr>

//       <td>Target Ach</td>

//       <td>100%</td>

//       <td>86</td>

//       <td>88</td>

//     </tr>

//     <tr>

//       <td>Secondary Gr%</td>

//       <td>22</td>

//       <td>71</td>

//       <td>75</td>

//     </tr>

//     <tr>

//       <td>Span of Performance</td>

//       <td>23</td>

//       <td>54</td>

//       <td>92</td>

//     </tr>

//     <tr>

//       <td>Dr.Conversion(Self Prio)</td>

//       <td>20</td>

//       <td>63</td>

//       <td>81</td>

//     </tr>

//     <tr>

//       <td>%Gr in Rxer</td>

//       <td>24</td>

//       <td>47</td>

//       <td>68</td>

//     </tr>

//     <tr>

//       <td>% of Viable Terr</td>

//       <td>24</td>

//       <td>79</td>

//       <td>68</td>

//     </tr>

//     <tr className="shade">

//       <td>Performance Score</td>

//       <td>24</td>

//       <td>91</td>

//       <td>68</td>

//     </tr>

//   </tbody>

// </table>







//           </div>



//         )}

//         {(role=== 'bh' || role==='sbuh') &&(

//           <div className="table-container">

//                               <HeadingWithHome level="h3">Bussiness and Brand Performance</HeadingWithHome>



//   <table className="custom-table">

//     <thead>

//       <tr>

//         <th>Parameter</th>

//         <th>Description</th>

//         <th>Objective</th>

//         <th>Month</th>

//         <th>YTD</th>

//         <th>Month Val</th>

//         <th>YTD Val</th>

//         <th>Month</th>

//         <th>YTD</th>

//       </tr>

//     </thead>



//     <tbody>

//       <tr>

//         <td rowSpan="5">Target / Objective Realization</td>

//         <td>% of Targets achieved ≥100%</td>

//         <td>100%</td>

//         <td >53%</td>

//         <td >9%</td>

//         <td>51.12/95.76</td>

//         <td>27.43/305.4</td>

//         <td>5.00%</td>

//         <td>1.00%</td>

//       </tr>



//       <tr>

//         <td>Brand Performance</td>

//         <td>100%</td>

//         <td >57%</td>

//         <td >49%</td>

//         <td>56.57/100</td>

//         <td>56.57/100</td>

//         <td>6.00%</td>

//         <td>5.00%</td>

//       </tr>



//       <tr>

//         <td>% of BMs achieving ≥90% of targets</td>

//         <td>90%</td>

//         <td >0%</td>

//         <td >0%</td>

//         <td>0/10</td>

//         <td>0/10</td>

//         <td>0.00%</td>

//         <td>0.00%</td>

//       </tr>



//       <tr>

//         <td>Span of Performance</td>

//         <td>100%</td>

//         <td >57%</td>

//         <td >10%</td>

//         <td>57.46/100</td>

//         <td>10.31/100</td>

//         <td>2.87%</td>

//         <td>0.52%</td>

//       </tr>



//       <tr>

//         <td># Viability of Terr</td>

//         <td>100%</td>

//         <td >13%</td>

//         <td >0%</td>

//         <td>7/54</td>

//         <td>0/54</td>

//         <td>5.00%</td>

//         <td>5.00%</td>

//       </tr>



//       {/* Final Score Footer */}

//       <tr className="shade">

//         <td colSpan="2"><b>Compliance & Reporting Score</b></td>

//         <td><b>35%</b></td>

//         <td></td>

//         <td></td>

//         <td></td>

//         <td></td>

//         <td><b>18.87%</b></td>

//         <td><b>11.52%</b></td>

//       </tr>

//     </tbody>

//   </table>

// </div>



//         )



//         }



//         {role === 'bl' && (







//           <div className="table-container">

//                             <HeadingWithHome level="h1">Bussiness Performance</HeadingWithHome>

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



//         {(role === 'be' ) && (

         





//             <div className="table-container">

//                             <HeadingWithHome level="h1">Bussiness Performance</HeadingWithHome>

//              <table className="custom-table">

//   <thead>

//     <tr>

//       <th>Weightage</th>

//       <th>Parameter</th>

//       <th>Objective(%)</th>

//       <th>Month(%)</th>

//       <th>YTD(%)</th>

//     </tr>

//   </thead>

//   <tbody>

//     <tr>

//       <td>20%</td>

//       <td>Secondary Gr%</td>

//       <td>-</td>

//       <td>-</td>

//       <td>-</td>

//     </tr>

//     <tr>

//       <td>10%</td>

//       <td>MSR Achievement%</td>

//       <td>100</td>

//       <td>-</td>

//       <td>-</td>

//     </tr>

//     <tr>

//       <td>10%</td>

//       <td>% Gr in Rxer</td>

//       <td>5</td>

//       <td>-</td>

//       <td>-</td>

//     </tr>

//     <tr>

//       <td>10%</td>

//       <td>Brand Perf. Index</td>

//       <td>100</td>

//       <td>-</td>

//       <td>-</td>

//     </tr>

//     <tr className="shade">

//       <td>50%</td>

//       <td>Performance Score</td>

//       <td>50.00</td>

//       <td>-</td>

//       <td>-</td>

//     </tr>

//   </tbody>

// </table>





//           </div>



//         )}







//       </div>










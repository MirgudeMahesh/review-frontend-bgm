import React from 'react';

import '../styles.css';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Subnavbar from './Subnavbar';
import ActualCommit from './ActualCommit';
import { useRole } from './RoleContext';
import Textarea from './Textarea';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from '@fortawesome/free-solid-svg-icons';
import useEncodedTerritory from './hooks/useEncodedTerritory';

const Home = () => {
  const navigate = useNavigate();
  const { role, setRole } = useRole();
  const { decoded, encoded } = useEncodedTerritory();
  const location = useLocation();

  const [beData, setBeData] = useState(null);
  const [ytdData, setYtdData] = useState(null);

  const fmt = (v) => Number(parseFloat(v || 0)).toFixed(2);   // <--- 1 DECIMAL FORMATTER

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
          <FontAwesomeIcon icon={faHome} size="2x" />
        </button>
      </div>
    );
  };

  // ------------------------------------------------
  //        Fetch BE & YTD Data
  // ------------------------------------------------
  useEffect(() => {
    if (!decoded) return;

    const loadAll = async () => {
      try {
        NProgress.start();

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
      } catch (err) {
        console.error("API error:", err);
      } finally {
        NProgress.done();
      }
    };

    loadAll();
  }, [decoded]);

  // ------------------------------------------------
  //        Show loading until both API calls complete
  // ------------------------------------------------
  if (!beData || !ytdData) {
    return <p style={{ textAlign: "center" }}>Loading...</p>;
  }

  // ------------------------------------------------
  //        FINAL YTD TOTAL SCORE (1 DECIMAL)
  // ------------------------------------------------
  const totalYTDScore =
    (ytdData?.Secondary_Sales_growth_Score || 0) +
    (ytdData?.MSR_Achievement_Score || 0) +
    (ytdData?.RX_Growth_Score || 0) +
    (ytdData?.Brand_Performance_Index_Score || 0);
  const totalFTDScore=
  (beData?.Secondary_Sales_growth_Score || 0) +
    (beData?.MSR_Achievement_Score || 0) +
    (beData?.RX_Growth_Score || 0) +
    (beData?.Brand_Performance_Index_Score || 0);

  return (
    <div>
      <div className="table-box">
        <div className="table-container">
          <HeadingWithHome>Bussiness Performance</HeadingWithHome>

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

    {/* FINAL YTD TOTAL SCORE (SUM OF ALL SCORES) */}
    <td><b>{fmt(totalYTDScore)}</b></td>
  </tr>
</tbody>

          </table>

        </div>
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
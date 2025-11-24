import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import ActualCommit from './ActualCommit';
import Textarea from './Textarea';
import { useRole } from './RoleContext';
import Subnavbar from './Subnavbar';
import { useLocation, useNavigate } from 'react-router-dom';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import useEncodedTerritory from './hooks/useEncodedTerritory';

export default function FinalReport() {
  const { role, setRole, name, setName } = useRole();
  const [score1, setScore1] = useState(null);
  const [score2, setScore2] = useState(null);
  const [score3, setScore3] = useState(null);
  const [score4, setScore4] = useState(null);
const [roleAllowed, setRoleAllowed] = useState(null); 

  const location = useLocation();
  const navigate = useNavigate();
  const { decoded, encoded } = useEncodedTerritory();

  const gotoselection = () => {
     navigate(`/Selection?ec=${encoded}`);
  }
 useEffect(() => {
  if (!decoded) return;

  const verifyRole = async () => {
    try {
      const res = await fetch(`https://review-backend-bgm.onrender.com/checkrole?territory=${decoded}`);
      const data = await res.json();

      setRoleAllowed(data.allowed);

      if (!data.allowed) {
        return; // stop here — do NOT fetch YTD/FTD
      }

      // ---- Load scores only if allowed ----
      NProgress.start();

      // YTD
      const ytdRes = await fetch("https://review-backend-bgm.onrender.com/dashboardYTD", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Territory: decoded })
      });
      const ytdData = await ytdRes.json();
      if (ytdRes.ok) {
        setScore1(Number(ytdData.totalScore1) || 0);
        setScore2(Number(ytdData.totalScore2) || 0);
      }

      // FTD
      const ftdRes = await fetch("https://review-backend-bgm.onrender.com/dashboardFTD", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Territory: decoded })
      });
      const ftdData = await ftdRes.json();
      if (ftdRes.ok) {
        setScore3(Number(ftdData.totalScore3) || 0);
        setScore4(Number(ftdData.totalScore4) || 0);
      }

    } catch (err) {
      console.error("API error:", err);
    } finally {
      NProgress.done();
    }
  };

  verifyRole();
}, [decoded]);


  const perform = () => navigate(`/TeamBuild?ec=${encoded}`);
  const Home = () => navigate(`/Performance?ec=${encoded}`);
  const misc = () => navigate(`/Hygine?ec=${encoded}`);
  const commitment = () => navigate(`/Compliance?ec=${encoded}`);

  // Safe Loading State
  if (roleAllowed === false) {
  return (
   <div
  style={{
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "70vh",
    textAlign: "center",
    padding: "20px"
  }}
>
  <p
    style={{
      fontSize: "20px",
      fontWeight: "600",
      marginBottom: "15px",
      color: "#333"
    }}
  >
    Your dashboards are yet to be updated
  </p>

  <button
    style={{
      padding: "12px 26px",
      backgroundColor: "#2c2d2e",
      color: "white",
      border: "none",
      borderRadius: "10px",
      fontSize: "18px",
      cursor: "pointer",
      boxShadow: "0px 4px 12px rgba(0,0,0,0.15)",
      transition: "0.2s ease",
    }}
    onMouseOver={e => (e.target.style.backgroundColor = "#1d1e1f")}
    onMouseOut={e => (e.target.style.backgroundColor = "#2c2d2e")}
    onClick={gotoselection}
  >
    Review Others
  </button>
</div>

  );
}

  if ([score1, score2, score3, score4].includes(null)) {
    return <p style={{ textAlign: "center" }}>Loading...</p>;
  }

  return (
    <div>
      <div className="table-box">
        <div className="table-container">

          <h3 style={{ textAlign: 'center' }}>Efficiency Index</h3>

          <div className="table-scroll">
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
                  <td onClick={perform}>Team Building and Development</td>
                  <td>50</td>
                  <td>{score3}</td>
                  <td>{score1}</td>
                </tr>

                <tr>
                  <td onClick={Home}>Business Performance</td>
                  <td>50</td>
                  <td>{score4}</td>
                  <td>{score2}</td>
                </tr>

                <tr className="shade">
                  <td>Efficiency Index</td>
                  <td>100</td>

                  {/* FIXED: true numeric addition */}
                  <td>{(score3 + score4).toFixed(2)}</td>
                  <td>{(score1 + score2).toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="notes-box">
            <p>📌 <b>Click on Parameter</b> to go to related dashboard</p>
            <p>⚠️ <b>Raise a ticket on iMACX</b> if you find any data inaccuracy</p>
          </div>

        </div>
      </div>
    </div>
  );
}




//temporaray
//  <div className="table-box">
//         {(role === 'be' ) && (
//           <div className="table-container">
//             {/* {name && <Subnavbar />} */}
//             <h3 style={{ textAlign: 'center' }}>Efficiency Index</h3>

//             <table className="custom-table">
//               <thead>
//                 <tr>
//                   <th>Parameter</th>
//                   <th>Objective(%)</th>
//                   <th>Month(%)</th>
//                   <th>YTD(%)</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 <tr>
//                   <td onClick={() => perform()}>Team Building and Development</td>
//                   <td>100%</td>
//                   <td>#REF!</td>
//                   <td>88</td>
//                 </tr>
//                 <tr>
//                   <td onClick={() => Home()}>Business Performance</td>
//                   <td>22</td>
//                   <td>57%</td>
//                   <td>75</td>
//                 </tr>
               
          
//                 <tr className="shade">
//                   <td>Efficiency Index</td>
//                   <td>24</td>
//                   <td>#REF!</td>
//                   <td>68</td>
//                 </tr>
//               </tbody>
//             </table>

//             {/* {name && <Textarea onsubmit={handleSubmit} />} */}
//           </div>
//         )}
//       {  (role ==='bh' || role==='sbuh') &&(
//           <div className="table-container">
//   <h3 style={{ textAlign: 'center' }}>Efficiency Index</h3>

//   <table className="custom-table">
//     <thead>
//       <tr>
//         <th>Parameter</th>
//         <th>Objective</th>
//         <th>Month</th>
//         <th>YTD</th>
//       </tr>
//     </thead>

//     <tbody>
//       <tr>
//         <td onClick={() => perform()}>Team &amp; Culture Building </td>
//         <td>25%</td>
//         <td >18%</td>
//         <td >12%</td>
//       </tr>

//       <tr>
//         <td onClick={() => Home()}>Business &amp; Brand Performance </td>
//         <td>35%</td>
//         <td >19%</td>
//         <td >12%</td>
//       </tr>

//       <tr>
//         <td onClick={() => commitment()}>Activity &amp; Productivity</td>
//         <td>20%</td>
//         <td >13%</td>
//         <td >12%</td>
//       </tr>

//       <tr>
//         <td onClick={() => misc()}>Business Hygiene &amp; Demand Quality</td>
//         <td>20%</td>
//         <td >16%</td>
//         <td >-132%</td>
//       </tr>

//       <tr className="shade">
//         <td><b>Efficiency Index</b></td>
//         <td><b>100%</b></td>
//         <td><b>66.30%</b></td>
//         <td><b>-96.64%</b></td>
//       </tr>
//     </tbody>
//   </table>
// </div>

//         )}

//         {role === 'bm' && (
//           <div className="table-container">
//             {/* {name && <Subnavbar />} */}
//             <h3 style={{ textAlign: 'center' }}>Efficiency Index</h3>

//             <table className="custom-table">
//               <thead>
//                 <tr>
//                   <th>Parameter</th>
//                   <th>Objective(%)</th>
//                   <th>Month(%)</th>
//                   <th>YTD(%)</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 <tr>
//                   <td onClick={() => perform()}>Team Building and Development</td>
//                   <td>100%</td>
//                   <td>#REF!</td>
//                   <td>88</td>
//                 </tr>
//                 <tr>
//                   <td onClick={() => Home()}>Business Performance</td>
//                   <td>22</td>
//                   <td>57%</td>
//                   <td>75</td>
//                 </tr>
              
//                 <tr>
//                   <td onClick={() => misc()}>Business Hygiene and Demand Quality</td>
//                   <td>20</td>
//                   <td>#REF!</td>
//                   <td>81</td>
//                 </tr>
//                 <tr className="shade">
//                   <td>Efficiency Index</td>
//                   <td>24</td>
//                   <td>#REF!</td>
//                   <td>68</td>
//                 </tr>
//               </tbody>
//             </table>

//             {/* {name && <Textarea onsubmit={handleSubmit} />} */}
//           </div>
//         )}

//         {role === 'bl' && (
//           <div className="table-container">
//             {/* {name && <Subnavbar />} */}
//             <h3 style={{ textAlign: 'center' }}>Efficiency Index</h3>

//             <table className="custom-table">
//               <thead>
//                 <tr>
//                   <th>Parameter</th>
//                   <th>Objective(%)</th>
//                   <th>Month(%)</th>
//                   <th>YTD(%)</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 <tr>
//                   <td onClick={() => perform()}>Team Building and Development</td>
//                   <td>100%</td>
//                   <td>#REF!</td>
//                   <td>88</td>
//                 </tr>
//                 <tr>
//                   <td onClick={() => Home()}>Business Performance</td>
//                   <td>22</td>
//                   <td>57%</td>
//                   <td>75</td>
//                 </tr>
//                 <tr>
//                   <td onClick={() => commitment()}>Compliance and Reporting</td>
//                   <td>23</td>
//                   <td>#REF!</td>
//                   <td>92</td>
//                 </tr>
//                 <tr>
//                   <td onClick={() => misc()}>Business Hygiene and Demand Quality</td>
//                   <td>20</td>
//                   <td>#REF!</td>
//                   <td>81</td>
//                 </tr>
//                 <tr className="shade">
//                   <td>Efficiency Index</td>
//                   <td>24</td>
//                   <td>#REF!</td>
//                   <td>68</td>
//                 </tr>
//               </tbody>
//             </table>

//             {/* {name && <Textarea onsubmit={handleSubmit} />} */}

          
//           </div>
//         )}
//       </div>
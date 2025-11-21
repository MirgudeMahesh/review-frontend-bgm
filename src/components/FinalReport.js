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
  const [selectedDate, setSelectedDate] = useState('');
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);
  const [score3, setScore3] = useState(0);
      const [score4, setScore4] = useState(0);

  const location = useLocation();
  const navigate = useNavigate();

  const { decoded, encoded } = useEncodedTerritory();

  // Fetch YTD Scores from backend
  useEffect(() => {
    if (!decoded) return;

    const fetchYTD = async () => {
      try {
        NProgress.start();
        const response = await fetch("https://review-backend-bgm.onrender.com/dashboardYTD", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ Territory: decoded })
        });

        const data = await response.json();

        if (response.ok) {
          setScore1(data.totalScore1 || 0);
          setScore2(data.totalScore2 || 0);
        }
      } catch (err) {
        console.error("API error:", err);
      } finally {
        NProgress.done();
      }
    };
const fetchFTD = async () => {
      try {
        NProgress.start();
        const response = await fetch("https://review-backend-bgm.onrender.com/dashboardFTD", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ Territory: decoded })
        });

        const data = await response.json();

        if (response.ok) {
          setScore3(data.totalScore3 || 0);
          setScore4(data.totalScore4 || 0);
          console.log("FTD Data:", data);
        }
      } catch (err) {
        console.error("YTD API error:", err);
      } finally {
        NProgress.done();
      }
    };
    fetchYTD();
    fetchFTD();
  }, [decoded]);

  const perform = () => {
    navigate(`/TeamBuild?ec=${encoded}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const Home = () => {
    navigate(`/Performance?ec=${encoded}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const misc = () => {
    navigate(`/Hygine?ec=${encoded}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const commitment = () => {
    navigate(`/Compliance?ec=${encoded}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
if (!score1 || !score3) {
    return <p style={{ textAlign: "center" }}>Loading...</p>;
  }
  return (
    <div>
      <div className="table-box">
        <div className="table-container">
          <h3 style={{ textAlign: 'center' }}>Efficiency Index</h3>

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
                <td onClick={() => perform()}>Team Building and Development</td>
                <td>50</td>
                <td>{score3}</td>

                {/* ROW 1 YTD → totalScore1 */}
                <td>{score1}</td>
              </tr>

              <tr>
                <td onClick={() => Home()}>Business Performance</td>
                <td>50</td>
                <td>{score4}</td>

                {/* ROW 2 YTD → totalScore2 */}
                <td>{score2}</td>
              </tr>

              <tr className="shade">
                <td>Efficiency Index</td>
                <td>100</td>
                <td>{Number(parseFloat((score3 + score4))).toFixed(2)}</td>

                {/* ROW 3 YTD → score1 + score2 */}
                <td>{Number(parseFloat((score1 + score2))).toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
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
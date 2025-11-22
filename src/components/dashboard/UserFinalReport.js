import React, { useEffect, useState } from 'react';
import Navbar from '../Navbar';
import ActualCommit from '../ActualCommit';
import Chats from './Chats';
import Textarea from '../Textarea';
import { useRole } from '../RoleContext';
import Subnavbar from '../Subnavbar';
import useProfileTerritory from '../hooks/useProfileTerritory';
import '../../styles.css';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

export default function UserFinalReport() {
  const { userRole, role, setRole, name, setName } = useRole();
  const { profileTerritory } = useProfileTerritory();

  const [score1, setScore1] = useState(null);
  const [score2, setScore2] = useState(null);
  const [score3, setScore3] = useState(null);
  const [score4, setScore4] = useState(null);

  const handleSubmit = ({ text, selectedDate, warning, warntext, setWarning, setWarntext }) => {
    if (text === '') {
      setWarning(true);
      setWarntext('add text ');
      setTimeout(() => setWarning(false), 3000);
      return;
    }

    console.log("Submitted:", text);
    console.log("Selected Date:", selectedDate);
  };

  // Fetch YTD + FTD
  useEffect(() => {
    if (!profileTerritory) return;

    const fetchYTD = async () => {
      try {
        NProgress.start();
        const response = await fetch("https://review-backend-bgm.onrender.com/dashboardYTD", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ Territory: profileTerritory })
        });

        const data = await response.json();

        if (response.ok) {
          setScore1(data.totalScore1 || 0);
          setScore2(data.totalScore2 || 0);
        }
      } catch (err) {
        console.error("YTD API error:", err);
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
          body: JSON.stringify({ Territory: profileTerritory })
        });

        const data = await response.json();

        if (response.ok) {
          setScore3(data.totalScore3 || 0);
          setScore4(data.totalScore4 || 0);
        }
      } catch (err) {
        console.error("FTD API error:", err);
      } finally {
        NProgress.done();
      }
    };

    fetchYTD();
    fetchFTD();
  }, [profileTerritory]);

  if (score1 === null || score3 === null) {
    return <p style={{ textAlign: "center" }}>Loading...</p>;
  }

  return (
    <div>
      <div className="table-box">
        <div className="table-container">

          {name && <Subnavbar />}

          <h3 style={{ textAlign: 'center' }}>Efficiency Index</h3>

          {/* SCROLL WRAPPER FIX */}
          <div className="table-scroll">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>Objective</th>
                  <th>Month</th>
                  <th>YTD</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>Team Building and Development</td>
                  <td>50</td>
                  <td>{score3}</td>
                  <td>{score1}</td>
                </tr>

                <tr>
                  <td>Business Performance</td>
                  <td>50</td>
                  <td>{score4}</td>
                  <td>{score2}</td>
                </tr>

                <tr className="shade">
                  <td>Efficiency Index</td>
                  <td>100</td>
                  <td>{Number(parseFloat(score3 + score4)).toFixed(2)}</td>
                  <td>{Number(parseFloat(score1 + score2)).toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
}




  //  <div className="table-box">
  //       {(userRole === 'BE' ) && (
  //         <div className="table-container">
  //           {name && <Subnavbar />}
  //           <h3 style={{ textAlign: 'center' }}>Efficiency Index</h3>

  //           <table className="custom-table">
  //             <thead>
  //               <tr>
  //                 <th>Parameter</th>
  //                 <th>Objective(%)</th>
  //                 <th>Month(%)</th>
  //                 <th>YTD(%)</th>
  //               </tr>
  //             </thead>
  //             <tbody>
  //               <tr>
  //                 <td>Team Building and Development</td>
  //                 <td>100%</td>
  //                 <td>#REF!</td>
  //                 <td>88</td>
  //               </tr>
  //               <tr>
  //                 <td>Business Performance</td>
  //                 <td>22</td>
  //                 <td>57%</td>
  //                 <td>75</td>
  //               </tr>
               
  //               <tr className="shade">
  //                 <td>Efficiency Index</td>
  //                 <td>24</td>
  //                 <td>#REF!</td>
  //                 <td>68</td>
  //               </tr>
  //             </tbody>
  //           </table>

         
  //         </div>
  //       )}

  //       {userRole === 'BM' && (
  //         <div className="table-container">
  //           {name && <Subnavbar />}
  //           <h3 style={{ textAlign: 'center' }}>Efficiency Index</h3>

  //           <table className="custom-table">
  //             <thead>
  //               <tr>
  //                 <th>Parameter</th>
  //                 <th>Objective(%)</th>
  //                 <th>Month(%)</th>
  //                 <th>YTD(%)</th>
  //               </tr>
  //             </thead>
  //             <tbody>
  //               <tr>
  //                 <td>Team Building and Development</td>
  //                 <td>100%</td>
  //                 <td>#REF!</td>
  //                 <td>88</td>
  //               </tr>
  //               <tr>
  //                 <td>Business Performance</td>
  //                 <td>22</td>
  //                 <td>57%</td>
  //                 <td>75</td>
  //               </tr>
              
  //               <tr>
  //                 <td>Business Hygiene and Demand Quality</td>
  //                 <td>20</td>
  //                 <td>#REF!</td>
  //                 <td>81</td>
  //               </tr>
  //               <tr className="shade">
  //                 <td>Efficiency Index</td>
  //                 <td>24</td>
  //                 <td>#REF!</td>
  //                 <td>68</td>
  //               </tr>
  //             </tbody>
  //           </table>

       
  //         </div>
  //       )}

  //       {userRole === 'BL' && (
  //         <div className="table-container">
  //           {name && <Subnavbar />}
  //           <h3 style={{ textAlign: 'center' }}>Efficiency Index</h3>

  //           <table className="custom-table">
  //             <thead>
  //               <tr>
  //                 <th>Parameter</th>
  //                 <th>Objective(%)</th>
  //                 <th>Month(%)</th>
  //                 <th>YTD(%)</th>
  //               </tr>
  //             </thead>
  //             <tbody>
  //               <tr>
  //                 <td>Team Building and Development</td>
  //                 <td>100%</td>
  //                 <td>#REF!</td>
  //                 <td>88</td>
  //               </tr>
  //               <tr>
  //                 <td>Business Performance</td>
  //                 <td>22</td>
  //                 <td>57%</td>
  //                 <td>75</td>
  //               </tr>
  //               <tr>
  //                 <td>Compliance and Reporting</td>
  //                 <td>23</td>
  //                 <td>#REF!</td>
  //                 <td>92</td>
  //               </tr>
  //               <tr>
  //                 <td>Business Hygiene and Demand Quality</td>
  //                 <td>20</td>
  //                 <td>#REF!</td>
  //                 <td>81</td>
  //               </tr>
  //               <tr className="shade">
  //                 <td>Efficiency Index</td>
  //                 <td>24</td>
  //                 <td>#REF!</td>
  //                 <td>68</td>
  //               </tr>
  //             </tbody>
  //           </table>


          
  //         </div>
  //       )}
  //     </div>
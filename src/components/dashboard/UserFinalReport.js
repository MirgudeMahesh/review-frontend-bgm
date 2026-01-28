import React, { useEffect, useState } from 'react';
import { useRole } from '../RoleContext';
import Subnavbar from '../Subnavbar';
import useProfileTerritory from '../hooks/useProfileTerritory';
import '../../styles.css';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

export default function UserFinalReport() {
  const { userRole, user } = useRole();
  const { profileTerritory } = useProfileTerritory();

  // States matching FinalReport.js structure
  const [score1, setScore1] = useState(null);        // effortYTD
  const [score2, setScore2] = useState(null);        // businessYTD  
  const [score3, setScore3] = useState(null);        // effortMonth
  const [score4, setScore4] = useState(null);        // businessMonth
  const [hygieneMonth, setHygieneMonth] = useState(null);
  const [hygieneYTD, setHygieneYTD] = useState(null);
  const [commitmentMonth, setCommitmentMonth] = useState(null);
  const [commitmentYTD, setCommitmentYTD] = useState(null);
  const [effortMonth, setEffortMonth] = useState(null);
  const [effortYTD, setEffortYTD] = useState(null);

  const fmt = (v) => Number.parseFloat(v || 0).toFixed(2);

  // Navigation functions matching FinalReport.js
  const navigate = () => {}; // Placeholder - use react-router-dom in real app
  const Home = () => navigate('/Performance');
  const perform = () => navigate('/TeamBuild');
  const misc = () => navigate('/Hygine');
  const commitment = () => navigate('/Compliance');

  useEffect(() => {
    if (!profileTerritory) return;

    const fetchData = async () => {
      try {
        NProgress.start();

        if (userRole === 'BL') {
          // BL LOGIC - Fetch blEfficiency endpoint (matching FinalReport.js)
          const blRes = await fetch("https://review-backend-bgm.onrender.com/blEfficiency", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ Territory: profileTerritory })
          });
          const blData = await blRes.json();

          console.log('BL Efficiency Data:', blData);

          if (blRes.ok) {
            // Map exactly like FinalReport.js
            setScore1(Number(blData.effortYTD) || 0);
            setScore2(Number(blData.businessYTD) || 0);
            setScore3(Number(blData.effortMonth) || 0);
            setScore4(Number(blData.businessMonth) || 0);
            
            // Additional BL scores
            setHygieneMonth(Number(blData.hygieneMonth) || 0);
            setHygieneYTD(Number(blData.hygieneYTD) || 0);
            setCommitmentMonth(Number(blData.commitmentMonth) || 0);
            setCommitmentYTD(Number(blData.commitmentYTD) || 0);
            setEffortMonth(Number(blData.effortMonth) || 0);
            setEffortYTD(Number(blData.effortYTD) || 0);
          }
        }
        // BM and BE logic remains same as existing
        else if (userRole === 'BM') {
          const res = await fetch('https://review-backend-bgm.onrender.com/bmEfficiency', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ Territory: profileTerritory }),
          });
          const data = await res.json();

          if (res.ok) {
            setScore1(Number(data.effortYTD) || 0);
            setScore2(Number(data.businessYTD) || 0);
            setScore3(Number(data.effortMonth) || 0);
            setScore4(Number(data.businessMonth) || 0);
            setHygieneMonth(Number(data.hygieneMonth) || 0);
            setHygieneYTD(Number(data.hygieneYTD) || 0);
          }
        } else if (userRole === 'BE') {
          const [ytdRes, ftdRes] = await Promise.all([
            fetch('https://review-backend-bgm.onrender.com/dashboardYTD', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ Territory: profileTerritory }),
            }),
            fetch('https://review-backend-bgm.onrender.com/dashboardFTD', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ Territory: profileTerritory }),
            }),
          ]);

          const [ytdData, ftdData] = await Promise.all([ytdRes.json(), ftdRes.json()]);

          if (ytdRes.ok) {
            setScore1(Number(ytdData.totalScore1) || 0);
            setScore2(Number(ytdData.totalScore2) || 0);
          }
          if (ftdRes.ok) {
            setScore3(Number(ftdData.totalScore3) || 0);
            setScore4(Number(ftdData.totalScore4) || 0);
          }
        }
      } catch (err) {
        console.error(`${userRole} efficiency API error:`, err);
      } finally {
        NProgress.done();
      }
    };

    fetchData();
  }, [profileTerritory, userRole]);

  // Loading states matching FinalReport.js exactly
  const isLoadingBL = 
    userRole === 'BL' && 
    [score1, score2, score3, score4, hygieneMonth, hygieneYTD, commitmentMonth, effortMonth].includes(null);

  const isLoadingBM = 
    userRole === 'BM' && 
    [score1, score2, score3, score4, hygieneMonth, hygieneYTD].includes(null);

  const isLoadingBE = 
    userRole === 'BE' && 
    [score1, score2, score3, score4].includes(null);

  if (isLoadingBL || isLoadingBM || isLoadingBE) {
    return <p style={{ textAlign: 'center' }}>Loading...</p>;
  }

  return (
    <div>
      <div className="table-box">
        <div className="table-container">
          <div className="efficiency-container">
            {user && <Subnavbar />}
            <h3 style={{ textAlign: 'center' }}>Efficiency Index</h3>

            {/* BL Table - DYNAMIC from blEfficiency API */}
            {userRole === 'BL' && (
              <div className="efficiency-table-container">
                <div className="efficiency-table-scroll">
                  <table className="efficiency-table">
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
                        <td className="clickable-param" onClick={Home}>
                          Business Performance
                        </td>
                        <td>35</td>
                        <td>{fmt(score4)}</td>
                        <td>{fmt(score2)}</td>
                      </tr>
                      <tr>
                        <td className="clickable-param" onClick={misc}>
                          Business Hygiene & Demand Quality
                        </td>
                        <td>20</td>
                        <td>{fmt(hygieneMonth)}</td>
                        <td>{fmt(hygieneYTD)}</td>
                      </tr>
                      <tr>
                        <td className="clickable-param" onClick={perform}>
                          Team Building 
                        </td>
                        <td>20</td>
                        <td>{fmt(effortMonth)}</td>
                        <td>{fmt(effortYTD)}</td>
                      </tr>
                      <tr>
                        <td className="clickable-param" onClick={commitment}>
                          Compliance & Reporting 
                        </td>
                        <td>25</td>
                        <td>{fmt(commitmentMonth)}</td>
                        <td>{fmt(commitmentYTD)}</td>
                      </tr>
                      <tr className="shade">
                        <td>Efficiency Index</td>
                        <td>100</td>
                        <td>
                          {(
                            Number(score4) + 
                            Number(hygieneMonth) + 
                            Number(effortMonth) + 
                            Number(commitmentMonth)
                          ).toFixed(2)}
                        </td>
                        <td>
                          {(
                            Number(score2) + 
                            Number(hygieneYTD) + 
                            Number(effortYTD) + 
                            Number(commitmentYTD)
                          ).toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* BM/BE Tables remain unchanged */}
            {(userRole === 'BM' || userRole === 'BE') && (
              <div className="efficiency-table-container">
                <div className="efficiency-table-scroll">
                  <table className="efficiency-table">
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
                        <td className="clickable-param" onClick={Home}>
                          Business Performance
                        </td>
                        <td>{userRole === 'BM' ? 50 : 50}</td>
                        <td>{fmt(score4)}</td>
                        <td>{fmt(score2)}</td>
                      </tr>
                      <tr>
                        <td className="clickable-param" onClick={perform}>
                          Efforts and Effectiveness
                        </td>
                        <td>{userRole === 'BM' ? 40 : 50}</td>
                        <td>{fmt(score3)}</td>
                        <td>{fmt(score1)}</td>
                      </tr>
                      {userRole === 'BM' && (
                        <tr>
                          <td className="clickable-param" onClick={misc}>
                            Hygiene
                          </td>
                          <td>10</td>
                          <td>{fmt(hygieneMonth)}</td>
                          <td>{fmt(hygieneYTD)}</td>
                        </tr>
                      )}
                      <tr className="shade">
                        <td>Efficiency Index</td>
                        <td>100</td>
                        <td>
                          {fmt(
                            Number(score4) +
                            Number(score3) +
                            (userRole === 'BM' ? Number(hygieneMonth) : 0)
                          )}
                        </td>
                        <td>
                          {fmt(
                            Number(score2) +
                            Number(score1) +
                            (userRole === 'BM' ? Number(hygieneYTD) : 0)
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="efficiency-notes-box">
              <p>📌 <b>Click on Parameter</b> to go to related dashboard</p>
              <p>⚠ <b>Raise a ticket on iMACX</b> if you find any data inaccuracy</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

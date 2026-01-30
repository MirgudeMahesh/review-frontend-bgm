import React, { useEffect, useState } from 'react';
import { useRole } from './RoleContext';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from 'react-router-dom';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import useEncodedTerritory from './hooks/useEncodedTerritory';

export default function FinalReport() {
  const { setRole, setName } = useRole();
  const [score1, setScore1] = useState(null);
  const [score2, setScore2] = useState(null);
  const [score3, setScore3] = useState(null);
  const [score4, setScore4] = useState(null);
  const [hygieneMonth, setHygieneMonth] = useState(null);
  const [hygieneYTD, setHygieneYTD] = useState(null);
  const [commitmentMonth, setCommitmentMonth] = useState(null);
  const [commitmentYTD, setCommitmentYTD] = useState(null);
  const [effortMonth, setEffortMonth] = useState(null);
  const [effortYTD, setEffortYTD] = useState(null);
  const [roleAllowed, setRoleAllowed] = useState(null);
  const [showTerritory, setShowTerritory] = useState('');
  const [myName, setMyName] = useState('');

  const navigate = useNavigate();
  const { decoded, encoded } = useEncodedTerritory();

  const gotoselection = () => {
    navigate(`/Selection?ec=${encoded}`);
  };

  useEffect(() => {
    if (!decoded) return;

    const verifyRole = async () => {
      try {
        NProgress.start();

        const res = await fetch(`https://review-backend-bgm.onrender.com/checkrole?territory=${decoded}`);
        const data = await res.json();
        
        setShowTerritory(decoded);
        setMyName(data.name);
        setName(data.name);

        // Set role conditionally
        const normalizedRole = ['BE', 'TE', 'KAE', 'NE'].includes(data.role) ? 'BE' : data.role;
        setRoleAllowed(normalizedRole);
        setRole(normalizedRole);

        // Only fetch dashboard data for BE, BM, BL, BH, SBUH roles
        if (!['BE', 'BM', 'BL', 'BH', 'SBUH'].includes(normalizedRole)) {
          return;
        }

        if (normalizedRole === 'BE') {
          // BE LOGIC - Fetch YTD and FTD data
          const [ytdRes, ftdRes] = await Promise.all([
            fetch("https://review-backend-bgm.onrender.com/dashboardYTD", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ Territory: decoded })
            }),
            fetch("https://review-backend-bgm.onrender.com/dashboardFTD", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ Territory: decoded })
            })
          ]);

          const ytdData = await ytdRes.json();
          const ftdData = await ftdRes.json();

          if (ytdRes.ok) {
            setScore1(Number(ytdData.totalScore1) || 0);
            setScore2(Number(ytdData.totalScore2) || 0);
          }

          if (ftdRes.ok) {
            setScore3(Number(ftdData.totalScore3) || 0);
            setScore4(Number(ftdData.totalScore4) || 0);
          }

          console.log('YTD Data:', ytdData);
          console.log('FTD Data:', ftdData);
        } 
        else if (normalizedRole === 'BM') {
          // BM LOGIC - Fetch efficiency data
          const bmRes = await fetch("https://review-backend-bgm.onrender.com/bmEfficiency", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ Territory: decoded })
          });
          const bmData = await bmRes.json();

          if (bmRes.ok) {
            setScore1(Number(bmData.effortYTD) || 0);
            setScore3(Number(bmData.effortMonth) || 0);
            setScore2(Number(bmData.businessYTD) || 0);
            setScore4(Number(bmData.businessMonth) || 0);
            setHygieneMonth(Number(bmData.hygieneMonth) || 0);
            setHygieneYTD(Number(bmData.hygieneYTD) || 0);
          }

          console.log('BM Data:', bmData);
        }
        else if (normalizedRole === 'BL') {
          // BL LOGIC - Fetch efficiency data
          const blRes = await fetch("https://review-backend-bgm.onrender.com/blEfficiency", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ Territory: decoded })
          });
          const blData = await blRes.json();

          if (blRes.ok) {
            setScore1(Number(blData.effortYTD) || 0);
            setScore2(Number(blData.businessYTD) || 0);
            setScore3(Number(blData.effortMonth) || 0);
            setScore4(Number(blData.businessMonth) || 0);
            setHygieneMonth(Number(blData.hygieneMonth) || 0);
            setHygieneYTD(Number(blData.hygieneYTD) || 0);
            setCommitmentMonth(Number(blData.commitmentMonth) || 0);
            setCommitmentYTD(Number(blData.commitmentYTD) || 0);
            setEffortMonth(Number(blData.effortMonth) || 0);
            setEffortYTD(Number(blData.effortYTD) || 0);
          }

          console.log('BL Data:', blData);
        }
        else if (normalizedRole === 'BH') {
          // BH LOGIC - Fetch efficiency data
          const bhRes = await fetch("https://review-backend-bgm.onrender.com/bhEfficiency", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ Territory: decoded })
          });
          const bhData = await bhRes.json();

          if (bhRes.ok) {
            setScore1(Number(bhData.effortYTD) || 0);
            setScore2(Number(bhData.businessYTD) || 0);
            setScore3(Number(bhData.effortMonth) || 0);
            setScore4(Number(bhData.businessMonth) || 0);
            setHygieneMonth(Number(bhData.hygieneMonth) || 0);
            setHygieneYTD(Number(bhData.hygieneYTD) || 0);
            setCommitmentMonth(Number(bhData.commitmentMonth) || 0);
            setCommitmentYTD(Number(bhData.commitmentYTD) || 0);
            setEffortMonth(Number(bhData.effortMonth) || 0);
            setEffortYTD(Number(bhData.effortYTD) || 0);
          }

          console.log('BH Data:', bhData);
        }
        else if (normalizedRole === 'SBUH') {
          // SBUH LOGIC - Fetch efficiency data
          const sbuhRes = await fetch("https://review-backend-bgm.onrender.com/sbuhEfficiency", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ Territory: decoded })
          });
          const sbuhData = await sbuhRes.json();

          if (sbuhRes.ok) {
            setScore1(Number(sbuhData.effortYTD) || 0);
            setScore2(Number(sbuhData.businessYTD) || 0);
            setScore3(Number(sbuhData.effortMonth) || 0);
            setScore4(Number(sbuhData.businessMonth) || 0);
            setHygieneMonth(Number(sbuhData.hygieneMonth) || 0);
            setHygieneYTD(Number(sbuhData.hygieneYTD) || 0);
            setCommitmentMonth(Number(sbuhData.commitmentMonth) || 0);
            setCommitmentYTD(Number(sbuhData.commitmentYTD) || 0);
            setEffortMonth(Number(sbuhData.effortMonth) || 0);
            setEffortYTD(Number(sbuhData.effortYTD) || 0);
          }

          console.log('SBUH Data:', sbuhData);
        }
      } catch (err) {
        console.error("API error:", err);
      } finally {
        NProgress.done();
      }
    };

    verifyRole();
  }, [decoded, setRole, setName, encoded]);

  const perform = () => navigate(`/TeamBuild?ec=${encoded}`);
  const Home = () => navigate(`/Performance?ec=${encoded}`);
  const misc = () => navigate(`/Hygine?ec=${encoded}`);
  const commitment = () => navigate(`/Compliance?ec=${encoded}`);
  const bulkUpload = () => navigate(`/Disclosure?ec=${encoded}`);

  // Show message for non-BE/BM/BL/BH/SBUH roles
  if (roleAllowed !== null && !['BE', 'BM', 'BL', 'BH', 'SBUH'].includes(roleAllowed)) {
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
        <p
          style={{
            fontSize: "14px",
            color: "#666",
            marginBottom: "20px"
          }}
        >
          Your current role: <strong>{roleAllowed}</strong>
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

        {roleAllowed === 'SBUH' && (
          <button 
            onClick={bulkUpload}
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              marginTop: '15px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#0056b3'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#007bff'}
          >
            Compose
            <FontAwesomeIcon icon={faPaperPlane} />
          </button>
        )}
      </div>
    );
  }

  // Loading states
  if (roleAllowed === 'BE' && [score1, score2, score3, score4].some(s => s === null)) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <p style={{ fontSize: '18px', color: '#666' }}>Loading dashboard data...</p>
      </div>
    );
  }

  if (roleAllowed === 'BM' && [score1, score2, score3, score4, hygieneMonth, hygieneYTD].some(s => s === null)) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <p style={{ fontSize: '18px', color: '#666' }}>Loading dashboard data...</p>
      </div>
    );
  }

  if (roleAllowed === 'BL' && [score1, score2, score3, score4, hygieneMonth, hygieneYTD, commitmentMonth, effortMonth].some(s => s === null)) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <p style={{ fontSize: '18px', color: '#666' }}>Loading dashboard data...</p>
      </div>
    );
  }

  if (roleAllowed === 'BH' && [score1, score2, score3, score4, hygieneMonth, hygieneYTD, commitmentMonth, effortMonth].some(s => s === null)) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <p style={{ fontSize: '18px', color: '#666' }}>Loading dashboard data...</p>
      </div>
    );
  }

  if (roleAllowed === 'SBUH' && [score1, score2, score3, score4, hygieneMonth, hygieneYTD, commitmentMonth, effortMonth].some(s => s === null)) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <p style={{ fontSize: '18px', color: '#666' }}>Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-shell">
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px 0',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          margin: '0 0 20px 0'
        }}
      >
        <p style={{ fontSize: '20px', fontWeight: '600', color: '#2c3e50', margin: '5px 0' }}>
          {myName}
        </p>
        <p style={{ fontSize: '14px', color: '#718096', margin: '5px 0' }}>
          {showTerritory}
        </p>
      </div>

      <div className="table-box">
        {roleAllowed === 'BE' && (
          <div className="efficiency-container">
            <h3>Efficiency Index</h3>
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
                      <td>50</td>
                      <td>{score4.toFixed(2)}</td>
                      <td>{score2.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td className="clickable-param" onClick={perform}>
                        Efforts and Effectiveness
                      </td>
                      <td>50</td>
                      <td>{score3.toFixed(2)}</td>
                      <td>{score1.toFixed(2)}</td>
                    </tr>
                    <tr className="shade">
                      <td>Efficiency Index</td>
                      <td>100</td>
                      <td>{(score3 + score4).toFixed(2)}</td>
                      <td>{(score1 + score2).toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="efficiency-notes-box">
              <p>📌 <b>Click on Parameter</b> to go to related dashboard</p>
              <p>⚠ <b>Raise a ticket on iMACX</b> if you find any data inaccuracy</p>
            </div>
          </div>
        )}

        {roleAllowed === 'BM' && (
          <div className="efficiency-container">
            <h3>Efficiency Index</h3>
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
                      <td>50</td>
                      <td>{score4.toFixed(2)}</td>
                      <td>{score2.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td className="clickable-param" onClick={perform}>
                        Efforts and Effectiveness
                      </td>
                      <td>40</td>
                      <td>{score3.toFixed(2)}</td>
                      <td>{score1.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td className="clickable-param" onClick={misc}>
                        Hygiene
                      </td>
                      <td>10</td>
                      <td>{hygieneMonth.toFixed(2)}</td>
                      <td>{hygieneYTD.toFixed(2)}</td>
                    </tr>
                    <tr className="shade">
                      <td>Efficiency Index</td>
                      <td>100</td>
                      <td>{(Number(score4) + Number(score3) + Number(hygieneMonth)).toFixed(2)}</td>
                      <td>{(Number(score2) + Number(score1) + Number(hygieneYTD)).toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="efficiency-notes-box">
              <p>📌 <b>Click on Parameter</b> to go to related dashboard</p>
              <p>⚠ <b>Raise a ticket on iMACX</b> if you find any data inaccuracy</p>
            </div>
          </div>
        )}

        {roleAllowed === 'BL' && (
          <div className="efficiency-container">
            <h3>Efficiency Index</h3>
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
                      <td>{score4.toFixed(2)}</td>
                      <td>{score2.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td className="clickable-param" onClick={misc}>
                        Business Hygiene & Demand Quality
                      </td>
                      <td>20</td>
                      <td>{hygieneMonth.toFixed(2)}</td>
                      <td>{hygieneYTD.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td className="clickable-param" onClick={perform}>
                        Team Building (Efforts)
                      </td>
                      <td>20</td>
                      <td>{effortMonth.toFixed(2)}</td>
                      <td>{effortYTD.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td className="clickable-param" onClick={commitment}>
                        Compliance & Reporting (Commitment)
                      </td>
                      <td>25</td>
                      <td>{commitmentMonth.toFixed(2)}</td>
                      <td>{commitmentYTD.toFixed(2)}</td>
                    </tr>
                    <tr className="shade">
                      <td>Efficiency Index</td>
                      <td>100</td>
                      <td>{(Number(score4) + Number(hygieneMonth) + Number(effortMonth) + Number(commitmentMonth)).toFixed(2)}</td>
                      <td>{(Number(score2) + Number(hygieneYTD) + Number(effortYTD) + Number(commitmentYTD)).toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="efficiency-notes-box">
              <p>📌 <b>Click on Parameter</b> to go to related dashboard</p>
              <p>⚠ <b>Raise a ticket on iMACX</b> if you find any data inaccuracy</p>
            </div>
          </div>
        )}

        {roleAllowed === 'BH' && (
          <div className="efficiency-container">
            <h3>Efficiency Index</h3>
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
                        Business & Brand Performance
                      </td>
                      <td>40</td>
                      <td>{score4.toFixed(2)}</td>
                      <td>{score2.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td className="clickable-param" onClick={misc}>
                        Business Hygiene & Demand Quality
                      </td>
                      <td>20</td>
                      <td>{hygieneMonth.toFixed(2)}</td>
                      <td>{hygieneYTD.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td className="clickable-param" onClick={perform}>
                        Team & Culture Building
                      </td>
                      <td>20</td>
                      <td>{effortMonth.toFixed(2)}</td>
                      <td>{effortYTD.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td className="clickable-param" onClick={commitment}>
                        Activity & Productivity
                      </td>
                      <td>20</td>
                      <td>{commitmentMonth.toFixed(2)}</td>
                      <td>{commitmentYTD.toFixed(2)}</td>
                    </tr>
                    <tr className="shade">
                      <td>Efficiency Index</td>
                      <td>100</td>
                      <td>{(Number(score4) + Number(hygieneMonth) + Number(effortMonth) + Number(commitmentMonth)).toFixed(2)}</td>
                      <td>{(Number(score2) + Number(hygieneYTD) + Number(effortYTD) + Number(commitmentYTD)).toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="efficiency-notes-box">
              <p>📌 <b>Click on Parameter</b> to go to related dashboard</p>
              <p>⚠ <b>Raise a ticket on iMACX</b> if you find any data inaccuracy</p>
            </div>
          </div>
        )}

        {roleAllowed === 'SBUH' && (
          <div className="efficiency-container">
            <h3>Efficiency Index</h3>
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
                      <td>{score4.toFixed(2)}</td>
                      <td>{score2.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td className="clickable-param" onClick={misc}>
                        Business Hygiene & Demand Quality
                      </td>
                      <td>20</td>
                      <td>{hygieneMonth.toFixed(2)}</td>
                      <td>{hygieneYTD.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td className="clickable-param" onClick={perform}>
                        Team Building 
                      </td>
                      <td>20</td>
                      <td>{effortMonth.toFixed(2)}</td>
                      <td>{effortYTD.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td className="clickable-param" onClick={commitment}>
                        Compliance & Reporting 
                      </td>
                      <td>25</td>
                      <td>{commitmentMonth.toFixed(2)}</td>
                      <td>{commitmentYTD.toFixed(2)}</td>
                    </tr>
                    <tr className="shade">
                      <td>Efficiency Index</td>
                      <td>100</td>
                      <td>{(Number(score4) + Number(hygieneMonth) + Number(effortMonth) + Number(commitmentMonth)).toFixed(2)}</td>
                      <td>{(Number(score2) + Number(hygieneYTD) + Number(effortYTD) + Number(commitmentYTD)).toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="efficiency-notes-box">
              <p>📌 <b>Click on Parameter</b> to go to related dashboard</p>
              <p>⚠ <b>Raise a ticket on iMACX</b> if you find any data inaccuracy</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

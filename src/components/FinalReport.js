import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import ActualCommit from './ActualCommit';
import Textarea from './Textarea';
import { useRole } from './RoleContext';
import Subnavbar from './Subnavbar';
import { useLocation, useNavigate } from 'react-router-dom';
import { faRotateLeft } from '@fortawesome/free-solid-svg-icons';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import useEncodedTerritory from './hooks/useEncodedTerritory';

export default function FinalReport() {

  const { role, setRole, name, setName } = useRole();
  const [score1, setScore1] = useState(null);
  const [score2, setScore2] = useState(null);
  const [score3, setScore3] = useState(null);
  const [score4, setScore4] = useState(null);
  const [hygieneMonth, setHygieneMonth] = useState(null);
  const [hygieneYTD, setHygieneYTD] = useState(null);
  const [roleAllowed, setRoleAllowed] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const [showTerritory,setShowTerritory]=useState('');
  const { decoded, encoded } = useEncodedTerritory();
const[myName,setMyName]=useState('');
  const gotoselection = () => {
    navigate(`/Selection?ec=${encoded}`);
  };

  useEffect(() => {
    if (!decoded) return;

    const verifyRole = async () => {
      try {
        const res = await fetch(`https://review-backend-bgm.onrender.com/checkrole?territory=${decoded}`);
        const data = await res.json();
       setShowTerritory(decoded)
        setRole(data.role);
        setRoleAllowed(data.role);
        setName(data.name);
        setMyName(data.name);
       
        if (data.role !== 'BE' && data.role !== 'BM') {
          return;
        }

        NProgress.start();

        if (data.role === 'BE') {
          // ---------- BE LOGIC (unchanged) ----------
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
        } else if (data.role === 'BM') {
          // ---------- BM LOGIC ----------
          const bmRes = await fetch("https://review-backend-bgm.onrender.com/bmEfficiency", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ Territory: decoded })
          });
          const bmData = await bmRes.json();

          if (bmRes.ok) {
            // Reuse score1–4 like BE:
            // Efforts & Effectiveness
            setScore1(Number(bmData.effortYTD) || 0);     // Effort YTD
            setScore3(Number(bmData.effortMonth) || 0);   // Effort Month

            // Business Performance
            setScore2(Number(bmData.businessYTD) || 0);   // Business YTD
            setScore4(Number(bmData.businessMonth) || 0); // Business Month

            // Hygiene
            setHygieneMonth(Number(bmData.hygieneMonth) || 0);
            setHygieneYTD(Number(bmData.hygieneYTD) || 0);
          }
        }
      } catch (err) {
        console.error("API error:", err);
      } finally {
        NProgress.done();
      }
    };

    verifyRole();
  }, [decoded, setRole]);

  const perform = () => navigate(`/TeamBuild?ec=${encoded}`);
  const Home = () => navigate(`/Performance?ec=${encoded}`);
  const misc = () => navigate(`/Hygine?ec=${encoded}`);
  const commitment = () => navigate(`/Compliance?ec=${encoded}`);

  if (roleAllowed !== null && roleAllowed !== 'BE' && roleAllowed !== 'BM') {
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
      </div>
    );
  }

  if (roleAllowed === 'BE' && [score1, score2, score3, score4].includes(null)) {
    return <p style={{ textAlign: "center" }}>Loading...</p>;
  }

  if (roleAllowed === 'BM' &&
      [score1, score2, score3, score4, hygieneMonth, hygieneYTD].includes(null)) {
    return <p style={{ textAlign: "center" }}>Loading...</p>;
  }

return (
  <div className="dashboard-shell">
<div
  style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  }}
>
  <p>{myName}</p>
  <p>{showTerritory}</p>
</div>
    <div className="table-box">
      {(roleAllowed === 'BE') && (
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
                    <td>{score4}</td>
                    <td>{score2}</td>
                  </tr>
                  <tr>
                    <td className="clickable-param" onClick={perform}>
                      Efforts and Effectiveness
                    </td>
                    <td>50</td>
                    <td>{score3}</td>
                    <td>{score1}</td>
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

      {(roleAllowed === 'BM') && (
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
                    <td>{(
                      Number(score4) +
                      Number(score3) +
                      Number(hygieneMonth)
                    ).toFixed(2)}</td>
                    <td>{(
                      Number(score2) +
                      Number(score1) +
                      Number(hygieneYTD)
                    ).toFixed(2)}</td>
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

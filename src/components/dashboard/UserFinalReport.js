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
  const userRole=localStorage.getItem('choserole');
  const {  role, setRole, name, setName } = useRole();
  const { profileTerritory } = useProfileTerritory();

  const [score1, setScore1] = useState(null); // Efforts YTD (BE) / Efforts YTD (BM)
  const [score2, setScore2] = useState(null); // Business YTD
  const [score3, setScore3] = useState(null); // Efforts Month
  const [score4, setScore4] = useState(null); // Business Month

  const [hygieneMonth, setHygieneMonth] = useState(null); // BM only
  const [hygieneYTD, setHygieneYTD] = useState(null);     // BM only

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

  // Fetch YTD + FTD for BE / BM
  useEffect(() => {
    if (!profileTerritory) return;

    const loadBE = async () => {
      try {
        NProgress.start();

        const ytdRes = await fetch("https://review-backend-bgm.onrender.com/dashboardYTD", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ Territory: profileTerritory })
        });
        const ytdData = await ytdRes.json();
        if (ytdRes.ok) {
          setScore1(Number(ytdData.totalScore1) || 0);
          setScore2(Number(ytdData.totalScore2) || 0);
        }

        const ftdRes = await fetch("https://review-backend-bgm.onrender.com/dashboardFTD", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ Territory: profileTerritory })
        });
        const ftdData = await ftdRes.json();
        if (ftdRes.ok) {
          setScore3(Number(ftdData.totalScore3) || 0);
          setScore4(Number(ftdData.totalScore4) || 0);
        }
      } catch (err) {
        console.error("BE efficiency API error:", err);
      } finally {
        NProgress.done();
      }
    };

    const loadBM = async () => {
      try {
        NProgress.start();

        const res = await fetch("https://review-backend-bgm.onrender.com/bmEfficiency", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ Territory: profileTerritory })
        });
        const data = await res.json();

        if (res.ok) {
          // Reuse score1–4 for Business/Effort like BE
          setScore2(Number(data.businessYTD) || 0);   // Business YTD
          setScore4(Number(data.businessMonth) || 0); // Business Month

          setScore1(Number(data.effortYTD) || 0);     // Effort YTD
          setScore3(Number(data.effortMonth) || 0);   // Effort Month

          setHygieneMonth(Number(data.hygieneMonth) || 0);
          setHygieneYTD(Number(data.hygieneYTD) || 0);
        }
      } catch (err) {
        console.error("BM efficiency API error:", err);
      } finally {
        NProgress.done();
      }
    };

    if (userRole === 'BM') {
      loadBM();
    } else {
      loadBE();
    }
  }, [profileTerritory, userRole]);

  const isLoadingBE =
    userRole !== 'BM' &&
    (score1 === null || score2 === null || score3 === null || score4 === null);

  const isLoadingBM =
    userRole === 'BM' &&
    (score1 === null || score2 === null || score3 === null || score4 === null ||
      hygieneMonth === null || hygieneYTD === null);

  if (isLoadingBE || isLoadingBM) {
    return <p style={{ textAlign: "center" }}>Loading...</p>;
  }

  const fmt = (v) => Number(parseFloat(v || 0)).toFixed(2);

  return (
    <div>
      <div className="table-box">
        <div className="table-container">

          {name && <Subnavbar />}

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
                {/* Common rows for both BE and BM */}
                <tr>
                  <td>Efforts and Effectiveness</td>
                  <td>{userRole === 'BM' ? 40 : 50}</td>
                  <td>{fmt(score3)}</td>
                  <td>{fmt(score1)}</td>
                </tr>

                <tr>
                  <td>Business Performance</td>
                  <td>{userRole === 'BM' ? 50 : 50}</td>
                  <td>{fmt(score4)}</td>
                  <td>{fmt(score2)}</td>
                </tr>

                {userRole === 'BM' && (
                  <tr>
                    <td>Hygiene</td>
                    <td>10</td>
                    <td>{fmt(hygieneMonth)}</td>
                    <td>{fmt(hygieneYTD)}</td>
                  </tr>
                )}

                <tr className="shade">
                  <td>Efficiency Index</td>
                  <td>100</td>
                  <td>
                    {userRole === 'BM'
                      ? fmt(Number(score3) + Number(score4) + Number(hygieneMonth))
                      : fmt(Number(score3) + Number(score4))}
                  </td>
                  <td>
                    {userRole === 'BM'
                      ? fmt(Number(score1) + Number(score2) + Number(hygieneYTD))
                      : fmt(Number(score1) + Number(score2))}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
}

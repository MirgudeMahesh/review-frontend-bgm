import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faFloppyDisk } from '@fortawesome/free-solid-svg-icons';
import nProgress from 'nprogress';
import useEncodedTerritory from './hooks/useEncodedTerritory';
import useProfileTerritory from './hooks/useProfileTerritory';

export default function ActualCommit() {
  const [commitments, setCommitments] = useState([]);
  const location = useLocation();

  const { profileTerritory } = useProfileTerritory();
  const { decoded } = useEncodedTerritory();

  // ================= FETCH DATA =================


  useEffect(() => {
    const territory = location.pathname.startsWith("/profile")
      ? profileTerritory
      : decoded;

    if (!territory) {
      setCommitments([]);
      return;
    }

    nProgress.start();
    fetch(`https://review-backend-bgm.onrender.com/getData/${territory}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch data");
        return res.json();
      })
      .then((data) => setCommitments(data))
      .catch((err) => {
        console.error("Error fetching commitments:", err);
        setCommitments([]);
      })
      .finally(() => nProgress.done());
  }, [location]);

  // ================= HELPER FUNCTIONS =================

  const saveToDB = (row, field, value) => {
    nProgress.start();
    fetch("https://review-backend-bgm.onrender.com/updateCommitment", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: row.id,
        [field]: value,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to update ${field}`);
      })
      .catch((err) => console.error(`Error updating ${field}:`, err))
      .finally(() => nProgress.done());
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const tzOffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - tzOffset).toISOString().split("T")[0];
  };

  const getToday = () => {
    const today = new Date();
    const tzOffset = today.getTimezoneOffset() * 60000;
    return new Date(today.getTime() - tzOffset).toISOString().split("T")[0];
  };

  // ================= GOAL EDIT LOGIC =================

  const enableGoalEdit = (index) => {
    const updated = [...commitments];

    // prevent editing multiple rows
    updated.forEach((r) => (r._editingGoal = false));

    updated[index]._editingGoal = true;
    updated[index]._tempGoal = updated[index].goal ?? "";
    setCommitments(updated);
  };

  const handleGoalInputChange = (index, value) => {
    const updated = [...commitments];
    updated[index]._tempGoal = value;
    setCommitments(updated);
  };

  const saveGoal = (index) => {
    const updated = [...commitments];
    const row = updated[index];

    const goalValue = parseInt(row._tempGoal, 10);

    if (isNaN(goalValue) || goalValue < 1) {
      alert("Goal must be at least 1");
      return;
    }
    if (goalValue > 100) {
      alert("Goal cannot exceed 100");
      return;
    }

    row.goal = goalValue;
    row._goalLocked = true;
    row._editingGoal = false;

    setCommitments(updated);
    saveToDB(row, "goal", goalValue);
  };

  // ================= RECEIVER COMMIT DATE LOGIC =================

  const handleDateChange = (index, newDate) => {
    const updated = [...commitments];
    updated[index].receiver_commit_date = newDate;
    updated[index]._locked = true;

    setCommitments(updated);
    saveToDB(updated[index], "receiver_commit_date", newDate);
  };

  // ================= RENDER UI =================
  return (
    <div className="commitmenta">
      <div className="commit-padding">
        <h3 style={{ textAlign: "center" }}>Commitment</h3>

        <table className="custom-table-commit">
          <thead>
            <tr>
              <th>Metric</th>
              <th>Assigned by</th>
              <th>Commitment</th>
              <th>Goal</th>
              <th>Received Date</th>
              <th>Goal Date</th>
              <th>Receiver Commit Date</th>
            </tr>
          </thead>

          <tbody>
            {commitments.length > 0 ? (
              commitments.map((row, index) => {
                const dateSet = !!row.receiver_commit_date;

                return (
                  <tr key={row.id}>
                    <td>{row.metric}</td>
                    <td>{row.sender}</td>
                    <td>{row.commitment}</td>

                    {/* ============== GOAL COLUMN ============== */}
                    <td>
                      {location.pathname.startsWith("/profile") || row._goalLocked ? (
                        row.goal
                      ) : row._editingGoal ? (
                        <>
                          <input
                            type="text"
                            value={row._tempGoal}
                            onChange={(e) => handleGoalInputChange(index, e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && saveGoal(index)}
                            style={{ borderRadius: "5px", padding: "4px", width: "35px" }}
                            autoFocus
                          />
                          <button
                            onClick={() => saveGoal(index)}
                            className="commit-link-button"
                          >
                            <FontAwesomeIcon icon={faFloppyDisk} />
                          </button>
                        </>
                      ) : (
                        <>
                          {row.goal}
                          <button
                            onClick={() => enableGoalEdit(index)}
                            className="commit-link-button"
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </button>
                        </>
                      )}
                    </td>

                    {/* DATES */}
                    <td>{formatDate(row.received_date)}</td>
                    <td>{formatDate(row.goal_date)}</td>

                    {/* ============== RECEIVER COMMIT DATE COLUMN ============== */}
                    <td>
                      {location.pathname.startsWith("/profile") || dateSet || row._locked ? (
                        formatDate(row.receiver_commit_date)
                      ) : (
                        <input
                          type="month"
                          value={
                            row.receiver_commit_date
                              ? row.receiver_commit_date.slice(0, 7)
                              : ""
                          }
                          min={getToday().slice(0, 7)}
                          onChange={(e) => {
                            const [year, month] = e.target.value.split("-").map(Number);
                            const lastDay = new Date(year, month, 0)
                              .toISOString()
                              .split("T")[0];
                            handleDateChange(index, lastDay);
                          }}
                          style={{ borderRadius: "5px", padding: "4px" }}
                        />
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  No commitments added
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faFloppyDisk, faTimes } from '@fortawesome/free-solid-svg-icons';
import nProgress from 'nprogress';
import useEncodedTerritory from './hooks/useEncodedTerritory';
import useProfileTerritory from './hooks/useProfileTerritory';

export default function ActualCommit() {
  const [commitments, setCommitments] = useState([]);
  const [loading, setLoading] = useState(true);

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
      setLoading(false);
      return;
    }

    nProgress.start();
    fetch(`https://review-backend-bgm.onrender.com/getData/${territory}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch data");
        return res.json();
      })
      .then((data) => {
        const normalized = (data || []).map((r) => ({
          ...r,
          _editingGoal: false,
          _tempGoal: r.goal ?? "",
          _goalLocked: !!r._goalLocked || false,
          _editingReceiverDate: false,
          _tempReceiverDate: r.receiver_commit_date ? r.receiver_commit_date.slice(0, 7) : "",
          _locked: !!r._locked || false,
        }));
        setCommitments(normalized);
      })
      .catch((err) => {
        console.error("Error fetching commitments:", err);
        setCommitments([]);
      })
      .finally(() => {
        nProgress.done();
        setLoading(false);
      });
  }, [location, profileTerritory, decoded]);

  // ================= HELPERS =================

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
    return dateString.slice(0, 7); // YYYY-MM
  };

  const getToday = () => {
    const today = new Date();
    const tzOffset = today.getTimezoneOffset() * 60000;
    return new Date(today.getTime() - tzOffset).toISOString().split("T")[0];
  };

  // ================= GOAL EDIT LOGIC =================

  const enableGoalEdit = (index) => {
    const updated = [...commitments];
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
    const goalValue = row._tempGoal;

    row.goal = goalValue;
    row._goalLocked = true;
    row._editingGoal = false;

    setCommitments(updated);
    saveToDB(row, "goal", goalValue);
  };

  // ================= RECEIVER COMMIT DATE EDIT LOGIC =================

  const enableReceiverDateEdit = (index) => {
    const updated = [...commitments];
    updated.forEach((r) => (r._editingReceiverDate = false));
    updated[index]._editingReceiverDate = true;
    updated[index]._tempReceiverDate = updated[index].receiver_commit_date
      ? updated[index].receiver_commit_date.slice(0, 7)
      : "";
    setCommitments(updated);
  };

  const cancelReceiverDateEdit = (index) => {
    const updated = [...commitments];
    updated[index]._editingReceiverDate = false;
    updated[index]._tempReceiverDate = updated[index].receiver_commit_date
      ? updated[index].receiver_commit_date.slice(0, 7)
      : "";
    setCommitments(updated);
  };

  const handleReceiverDateTempChange = (index, ymValue) => {
    const updated = [...commitments];
    updated[index]._tempReceiverDate = ymValue;
    setCommitments(updated);
  };

  const saveReceiverDate = (index) => {
    const updated = [...commitments];
    const row = updated[index];
    const ym = row._tempReceiverDate;

    if (!ym || ym.length !== 7) {
      alert("Please select a valid month");
      return;
    }

    const finalDate = ym + "-01";
    row.receiver_commit_date = finalDate;
    row._locked = true;
    row._editingReceiverDate = false;

    setCommitments(updated);
    saveToDB(row, "receiver_commit_date", finalDate);
  };

  function handleDateChange(index, newDate) {
    const updated = [...commitments];
    updated[index].receiver_commit_date = newDate;
    updated[index]._locked = true;
    setCommitments(updated);
    saveToDB(updated[index], "receiver_commit_date", newDate);
  }

  // ================= RENDER UI =================

  if (loading) return <div />;

  return (
    
    <div className="commitment-card">
      <div className="commitment-inner">
        <h3 className="commitment-heading">Commitment</h3>

        <div className="commitment-table-scroll">
          <table className="commitment-table">
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

                      {/* GOAL COLUMN */}
                      <td>
                        {location.pathname.startsWith("/profile") || row._goalLocked ? (
                          row.goal
                        ) : row._editingGoal ? (
                          <div className="commit-edit-cell">
                            <input
                              type="text"
                              value={row._tempGoal}
                              onChange={(e) => handleGoalInputChange(index, e.target.value)}
                              onKeyDown={(e) => e.key === "Enter" && saveGoal(index)}
                              className="commit-input"
                              autoFocus
                            />
                            <button
                              onClick={() => saveGoal(index)}
                              className="commit-icon-btn"
                              title="Save goal"
                            >
                              <FontAwesomeIcon icon={faFloppyDisk} />
                            </button>
                          </div>
                        ) : (
                          <div className="commit-edit-cell">
                            <span>{row.goal}</span>
                            {!location.pathname.startsWith("/profile") && !row._goalLocked && (
                              <button
                                onClick={() => enableGoalEdit(index)}
                                className="commit-icon-btn"
                                title="Edit goal"
                              >
                                <FontAwesomeIcon icon={faEdit} />
                              </button>
                            )}
                          </div>
                        )}
                      </td>

                      {/* DATES */}
                      <td>{row.received_date}</td>
                      <td>{formatDate(row.goal_date)}</td>

                      {/* RECEIVER COMMIT DATE COLUMN */}
                      <td>
                        {location.pathname.startsWith("/profile") || (dateSet && row._locked) ? (
                          formatDate(row.receiver_commit_date)
                        ) : row._editingReceiverDate ? (
                          <div className="commit-edit-cell">
                            <input
                              type="month"
                              value={row._tempReceiverDate || ""}
                              min={getToday().slice(0, 7)}
                              onChange={(e) =>
                                handleReceiverDateTempChange(index, e.target.value)
                              }
                              className="commit-input"
                            />
                            <button
                              onClick={() => saveReceiverDate(index)}
                              className="commit-icon-btn"
                              title="Save receiver date"
                            >
                              <FontAwesomeIcon icon={faFloppyDisk} />
                            </button>
                            <button
                              onClick={() => cancelReceiverDateEdit(index)}
                              className="commit-icon-btn commit-icon-btn--secondary"
                              title="Cancel"
                            >
                              <FontAwesomeIcon icon={faTimes} />
                            </button>
                          </div>
                        ) : (
                          <div className="commit-edit-cell">
                            <span>{formatDate(row.receiver_commit_date)}</span>

                            {!location.pathname.startsWith("/profile") && !row._locked && (
                              <>
                                <button
                                  onClick={() => enableReceiverDateEdit(index)}
                                  className="commit-icon-btn"
                                  title="Edit receiver commit date"
                                >
                                  <FontAwesomeIcon icon={faEdit} />
                                </button>

                                {!dateSet && (
                                  <input
                                    type="month"
                                    value={row._tempReceiverDate || ""}
                                    min={getToday().slice(0, 7)}
                                    onChange={(e) => {
                                      const ym = e.target.value;
                                      if (!ym) return;
                                      const finalDate = ym + "-01";
                                      handleDateChange(index, finalDate);
                                    }}
                                    className="commit-input commit-input-inline"
                                  />
                                )}
                              </>
                            )}
                          </div>
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
    </div>
  );
}

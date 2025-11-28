import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faFloppyDisk, faTimes } from '@fortawesome/free-solid-svg-icons';
import nProgress from 'nprogress';
import useEncodedTerritory from './hooks/useEncodedTerritory';
import useProfileTerritory from './hooks/useProfileTerritory';

export default function ActualCommit() {
  const [commitments, setCommitments] = useState([]);
  const location = useLocation();

  const { profileTerritory } = useProfileTerritory();
  const { decoded } = useEncodedTerritory();

  // ================= FETCH DATA =================
  const [loading, setLoading] = useState(true);

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
        // Ensure each row has the helper flags used in UI
        const normalized = (data || []).map(r => ({
          ...r,
          _editingGoal: false,
          _tempGoal: r.goal ?? "",
          _goalLocked: !!r._goalLocked || false, // if you already persist lock flag, keep; else false
          _editingReceiverDate: false,
          _tempReceiverDate: r.receiver_commit_date ? r.receiver_commit_date.slice(0,7) : "",
          _locked: !!r._locked || false // existing lock flag for receiver date if you use it
        }));
        setCommitments(normalized);
      })
      .catch((err) => {
        console.error("Error fetching commitments:", err);
        setCommitments([]);
      })
      .finally(() => {
        nProgress.done();
        setLoading(false);   // ⭐ correct place
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
    // Expecting "YYYY-MM-DD" or already "YYYY-MM"
    return dateString.slice(0, 7);   // returns YYYY-MM
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
    row._goalLocked = true;     // lock after saving (same pattern you already have)
    row._editingGoal = false;

    setCommitments(updated);
    saveToDB(row, "goal", goalValue);
  };

  // ================= RECEIVER COMMIT DATE EDIT LOGIC =================

  const enableReceiverDateEdit = (index) => {
    const updated = [...commitments];
    // prevent editing multiple rows
    updated.forEach((r) => (r._editingReceiverDate = false));
    // set editing for the row
    updated[index]._editingReceiverDate = true;
    // set temp value to the current YYYY-MM if exists, else empty
    updated[index]._tempReceiverDate = updated[index].receiver_commit_date
      ? updated[index].receiver_commit_date.slice(0, 7)
      : "";
    setCommitments(updated);
  };

  const cancelReceiverDateEdit = (index) => {
    const updated = [...commitments];
    updated[index]._editingReceiverDate = false;
    // revert temp
    updated[index]._tempReceiverDate = updated[index].receiver_commit_date
      ? updated[index].receiver_commit_date.slice(0, 7)
      : "";
    setCommitments(updated);
  };

  const handleReceiverDateTempChange = (index, ymValue) => {
    const updated = [...commitments];
    updated[index]._tempReceiverDate = ymValue; // "YYYY-MM"
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

    const finalDate = ym + "-01"; // convert to YYYY-MM-01 (as requested)
    row.receiver_commit_date = finalDate;
    row._locked = true;                // lock after saving (parity with goal)
    row._editingReceiverDate = false;

    setCommitments(updated);
    saveToDB(row, "receiver_commit_date", finalDate);
  };

  // ================= RENDER UI =================
  if (loading) return (<div></div>);

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
                            title="Save goal"
                          >
                            <FontAwesomeIcon icon={faFloppyDisk} style={{ color: "black" }}/>
                          </button>
                        </>
                      ) : (
                        <>
                          {row.goal}
                          {!location.pathname.startsWith("/profile") && !row._goalLocked && (
                            <button
                              onClick={() => enableGoalEdit(index)}
                              className="commit-link-button"
                              title="Edit goal"
                            >
                              <FontAwesomeIcon icon={faEdit}  style={{ color: "black" }} />
                            </button>
                          )}
                        </>
                      )}
                    </td>

                    {/* DATES */}
                    <td>{row.received_date}</td>
                    <td>{formatDate(row.goal_date)}</td>

                    {/* ============== RECEIVER COMMIT DATE COLUMN ============== */}
                    <td>
                      {location.pathname.startsWith("/profile") || (dateSet && row._locked) ? (
                        // view-only when in profile or when date is locked
                        formatDate(row.receiver_commit_date)
                      ) : row._editingReceiverDate ? (
                        // editing mode: month picker + save + cancel
                        <>
                          <input
                            type="month"
                            value={row._tempReceiverDate || ""}
                            min={getToday().slice(0, 7)}
                            onChange={(e) => handleReceiverDateTempChange(index, e.target.value)}
                            style={{ borderRadius: "5px", padding: "4px" }}
                          />
                          <button
                            onClick={() => saveReceiverDate(index)}
                            className="commit-link-button"
                            title="Save receiver date"
                            style={{ marginLeft: 6 }}
                          >
                            <FontAwesomeIcon icon={faFloppyDisk} style={{ color: "black" }}/>
                          </button>
                          <button
                            onClick={() => cancelReceiverDateEdit(index)}
                            className="commit-link-button"
                            title="Cancel"
                            style={{ marginLeft: 6 }}
                          >
                            <FontAwesomeIcon icon={faTimes} />
                          </button>
                        </>
                      ) : (
                        // normal view: show YYYY-MM; if editable (not profile and not locked) show edit button
                        <>
                          {formatDate(row.receiver_commit_date)}
                          {!location.pathname.startsWith("/profile") && !row._locked && (
                            <button
                              onClick={() => enableReceiverDateEdit(index)}
                              className="commit-link-button"
                              title="Edit receiver commit date"
                              style={{ marginLeft: 8 }}
                            >
                              <FontAwesomeIcon icon={faEdit} style={{ color: "black" }} />
                            </button>
                          )}
                          {/* If no date set and not profile, show the picker immediately (original UX) */}
                          {!dateSet && !location.pathname.startsWith("/profile") && !row._locked && (
                            <input
                              type="month"
                              value={row._tempReceiverDate || ""}
                              min={getToday().slice(0, 7)}
                              onChange={(e) => {
                                // for immediate save when selecting a month (behaviour you had before)
                                const ym = e.target.value; // "YYYY-MM"
                                if (!ym) return;
                                const finalDate = ym + "-01";
                                handleDateChange(index, finalDate);
                              }}
                              style={{ borderRadius: "5px", padding: "4px", marginLeft: 8 }}
                            />
                          )}
                        </>
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

  // ================= RECEIVER COMMIT DATE LOGIC (kept below renderer for reuse) =================
  function handleDateChange(index, newDate) {
    // This function was in your original code and is used when picking & immediately saving (keeps as-is)
    const updated = [...commitments];
    updated[index].receiver_commit_date = newDate;
    updated[index]._locked = true;
    console.log("New Date Selected:", newDate);
    setCommitments(updated);
    saveToDB(updated[index], "receiver_commit_date", newDate);
  }
}

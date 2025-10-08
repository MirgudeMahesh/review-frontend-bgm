import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import {faFloppyDisk} from '@fortawesome/free-solid-svg-icons';
import nProgress from 'nprogress';
export default function ActualCommit() {
  const [commitments, setCommitments] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const territory = location.pathname.startsWith("/profile")
      ? localStorage.getItem("territory")
      : localStorage.getItem("empterr");

    if (!territory) {
      setCommitments([]);
      return;
    }

    nProgress.start();
    fetch(`http://localhost:8000/getData/${territory}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch data");
        return res.json();
      })
      .then((data) => setCommitments(data))
      .catch((err) => {
        console.error("Error fetching commitments:", err);
        setCommitments([]);
      }).finally(() => nProgress.done());
  }, [location]);

  // Handle receiver commit date change
const handleDateChange = (index, newDate) => {
  const updatedCommitments = [...commitments];
  updatedCommitments[index].receiver_commit_date = newDate;
  updatedCommitments[index]._locked = true;
  setCommitments(updatedCommitments);
  saveToDB(updatedCommitments[index], "receiver_commit_date", newDate);
};


  // Enable goal edit mode
  const enableGoalEdit = (index) => {
    const updatedCommitments = [...commitments];
    updatedCommitments[index]._editingGoal = true;
    updatedCommitments[index]._tempGoal = updatedCommitments[index].goal || "";
    setCommitments(updatedCommitments);
  };

// Update temp goal while typing
const handleGoalInputChange = (index, value) => {
  const updatedCommitments = [...commitments];
  updatedCommitments[index]._tempGoal = value;
  setCommitments(updatedCommitments);
};


 // Save goal to DB and exit edit mode
const saveGoal = (index) => {
  const updatedCommitments = [...commitments];
  const row = updatedCommitments[index];

  const goalValue = parseInt(row._tempGoal, 10);

  // Validation before saving
  if (isNaN(goalValue) || goalValue < 1) {
    alert("Goal must be at least 1");
    return;
  }
  if (goalValue > 100) {
    alert("Goal cannot exceed 100");
    return;
  }

  row.goal = goalValue; // commit validated value
  row._goalLocked = true;
  row._editingGoal = false;
  setCommitments(updatedCommitments);

  saveToDB(row, "goal", row.goal);
};


  // Save to DB (generic)
  const saveToDB = (row, field, value) => {
    nProgress.start();
    fetch(`http://localhost:8000/updateCommitment`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        metric: row.metric,
        sender_territory: row.sender_territory,
        receiver_territory: row.receiver_territory,
        [field]: value,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to update ${field}`);
        console.log(`${field} updated successfully`);
      })
      .catch((err) => console.error(`Error saving ${field}:`, err)).finally(() => { nProgress.done()})
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

  return (
    <div className="commitmenta">
      <div className="commit-padding">
        <h3 style={{ textAlign: "center" }}>Commitment</h3>
        <div>
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
                    <tr key={index}>
                      <td>{row.metric}</td>
                      <td>{row.sender}</td>
                      <td>{row.commitment}</td>

                      {/* Goal Column */}
                      <td>
                        {location.pathname.startsWith("/profile") || row._goalLocked ? (
                          row.goal
                        ) : row._editingGoal ? (
                          <>
                            <input
                              type="text"
                              value={row._tempGoal}
                              onChange={(e) => handleGoalInputChange(index, e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") saveGoal(index);
                              }}
                              style={{ borderRadius: "5px", padding: "4px",width:"30px" }}
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

                      <td>{formatDate(row.received_date)}</td>
                      <td>{formatDate(row.goal_date)}</td>

                     {/* Receiver Commit Date Column */}
<td>
  {location.pathname.startsWith("/profile") || dateSet || row._locked ? (
    formatDate(row.receiver_commit_date)
  ) : (
    <input
      type="month"
      value={
        row.receiver_commit_date
          ? row.receiver_commit_date.slice(0, 7) // keep only YYYY-MM for month input
          : ""
      }
      min={getToday().slice(0, 7)} // prevent past months
      onChange={(e) => {
        const [year, month] = e.target.value.split("-").map(Number);
        // get last day of the chosen month
        const lastDayOfMonth = new Date(year, month, 0)
          .toISOString()
          .split("T")[0];
        handleDateChange(index, lastDayOfMonth);
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
    </div>
  );
}

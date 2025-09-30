import React, { useState, useEffect } from 'react'   ;
import { useLocation } from 'react-router-dom';

export default function ActualCommit() {
  const [commitments, setCommitments] = useState([]);
  const location = useLocation();

  // Fetch data whenever URL changes
  useEffect(() => {
    // Determine territory dynamically
    const territory = location.pathname.startsWith("/profile")
      ? localStorage.getItem("territory")
      : localStorage.getItem("empterr");

    if (!territory) {
      setCommitments([]); // Clear commitments if no territory
      return;
    }

    fetch(`http://localhost:8000/getData/${territory}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch data");
        return res.json();
      })
      .then((data) => {
        setCommitments(data);
        console.log("Fetched commitments:", data);
      })
      .catch((err) => {
        console.error("Error fetching commitments:", err);
        setCommitments([]);
      });
  }, [location]); // Re-run on any route change

  // Update receiver_commit_date in state and save to DB
  const handleDateChange = (index, newDate) => {
    const updatedCommitments = [...commitments];
    updatedCommitments[index].receiver_commit_date = newDate;
    updatedCommitments[index]._locked = true; // Lock after first edit
    setCommitments(updatedCommitments);

    saveDateToDB(updatedCommitments[index]);
  };

  const saveDateToDB = (row) => {
    fetch(`http://localhost:8000/updateReceiverCommitDate`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        metric: row.metric,
        sender_territory: row.sender_territory,
        receiver_territory: row.receiver_territory,
        receiver_commit_date: row.receiver_commit_date,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update date");
        console.log("Date updated successfully");
      })
      .catch((err) => {
        console.error("Error saving date:", err);
      });
  };

  // Helper to fix timezone shift issue
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const tzOffset = date.getTimezoneOffset() * 60000; // shift in ms
    const localISO = new Date(date.getTime() - tzOffset)
      .toISOString()
      .split("T")[0];
    return localISO;
  };

  // Get today's date in YYYY-MM-DD format (local, no shift issue)
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
                <th>Sender</th>
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
                  const alreadySet = !!row.receiver_commit_date;

                  return (
                    <tr key={index}>
                      <td>{row.metric}</td>
                      <td>{row.sender}</td>
                      <td>{row.commitment}</td>
                      <td>{row.goal}</td>
                      <td>{formatDate(row.received_date)}</td>
                      <td>{formatDate(row.goal_date)}</td>
<td>
  {location.pathname.startsWith("/profile") ? (
    // Always readonly if in /profile
    formatDate(row.receiver_commit_date)
  ) : alreadySet || row._locked ? (
    // If already set or locked, show text
    formatDate(row.receiver_commit_date)
  ) : (
    // Editable only outside /profile
  <input
  type="date"
  value={row.receiver_commit_date ? formatDate(row.receiver_commit_date) : ""}
  min={getToday()} // today or future
  onChange={(e) => handleDateChange(index, e.target.value)}
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



// import React, { useState, useEffect } from 'react';

// export default function ActualCommit() {
//   const [commitments, setCommitments] = useState([]);
//   const territory = localStorage.getItem('empterr');

//   useEffect(() => {
//     if (!territory) return;

//     fetch(`http://localhost:8000/getData/${territory}`)
//       .then(res => {
//         if (!res.ok) throw new Error('Failed to fetch data');
//         return res.json();
//       })
//       .then(data => {
//         setCommitments(data);
//       })
//       .catch(err => {
//         console.error('Error fetching commitments:', err);
//       });
//   }, [territory]);

//   const handleDateChange = (index, newDate) => {
//     const updatedCommitments = [...commitments];
//     updatedCommitments[index].receiver_commit_date = newDate;
//     updatedCommitments[index]._locked = true; // Mark as locked after first edit
//     setCommitments(updatedCommitments);

//     saveDateToDB(updatedCommitments[index]);
//   };

//   const saveDateToDB = (row) => {
//     fetch(`http://localhost:8000/updateReceiverCommitDate`, {
//       method: 'PUT',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         metric: row.metric,
//         sender_territory: row.sender_territory,
//         receiver_territory: row.receiver_territory,
//         receiver_commit_date: row.receiver_commit_date
//       }),
//     })
//       .then(res => {
//         if (!res.ok) throw new Error('Failed to update date');
//         console.log('Date updated successfully');
//       })
//       .catch(err => {
//         console.error('Error saving date:', err);
//       });
//   };

//   return (
//     <div className='commitmenta'>
//       <div className='commit-padding'>
//         <h3 style={{ textAlign: 'center' }}>Commitment</h3>
//         <div>
//           <table className="custom-table-commit">
//             <thead>
//               <tr>
//                 <th>metric</th>
//                 <th>sender</th>
//                 <th>commitment</th>
//                 <th>goal</th>
//                 <th>received_date</th>
//                 <th>goal_date</th>
//                 <th>receiver_commit_date</th>
//               </tr>
//             </thead>
//             <tbody>
//               {commitments.length > 0 ? (
//                 commitments.map((row, index) => {
//                   const alreadySet = !!row.receiver_commit_date;
//                   return (
//                     <tr key={index}>
//                       <td>{row.metric}</td>
//                       <td>{row.sender}</td>
//                       <td>{row.commitment}</td>
//                       <td>{row.goal}</td>
//                       <td>{row.received_date ? row.received_date.split('T')[0] : ''}</td>
//                       <td>{row.goal_date ? row.goal_date.split('T')[0] : ''}</td>
//                       <td>
//                         {alreadySet || row._locked ? (
//                           // Show text if date already exists or locked after first edit
//                           row.receiver_commit_date ? row.receiver_commit_date.split('T')[0] : ''
//                         ) : (
//                           <input
//                             type="date"
//                             value={row.receiver_commit_date ? row.receiver_commit_date.split('T')[0] : ''}
//                             onChange={(e) => handleDateChange(index, e.target.value)}
//                             style={{ borderRadius: '5px' }}
//                           />
//                         )}
//                       </td>
//                     </tr>
//                   );
//                 })
//               ) : (
//                 <tr>
//                   <td colSpan="7" style={{ textAlign: 'center' }}>
//                     no commitments added
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }
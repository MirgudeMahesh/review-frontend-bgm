import React, { useState } from 'react';
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NProgress from 'nprogress';
import 'nprogress/nprogress.css'; 
import { useLocation } from 'react-router-dom';
import useEncodedTerritory from './hooks/useEncodedTerritory';
export default function Filtering() {
  const [text, setText] = useState('');
  const [metric, setMetric] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [warning, setWarning] = useState(false);
  const [warntext, setWarntext] = useState('');
  const [results, setResults] = useState([]); // backend response
  const [count,setCount]=useState();
    const location = useLocation();



  // decode base64 -> original territory
  const {decoded} = useEncodedTerritory();
  // 🔍 Fetch filtered data
  const showList = async () => {
    if (metric=== '') {
      setWarning(true);
      setWarntext('select metric with data');
      setTimeout(() => setWarning(false), 3000);
      return;
    } else if (isNaN(parseInt(from)) || isNaN(parseInt(to))) {
      setWarning(true);
      setWarntext('Range should be integer');
      setTimeout(() => setWarning(false), 3000);
      return;
    } else if (parseInt(from) > parseInt(to)) {
      setWarning(true);
      setWarntext('give proper range');
      setTimeout(() => setWarning(false), 3000);
      return;
    }

    try {
      NProgress.start();
      const response = await fetch("https://review-backend-bgm.onrender.com/filterData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          metric,
          from: parseInt(from),
          to: parseInt(to),
        }),
      });
     
      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();
      setResults(data);
      

   
      setWarning(true);

      if(data.length===0){
              setWarntext('No data in this range');

      }
      else{
      setWarntext('Data fetched successfully below');
    setCount(data.length);}
      setTimeout(() => setWarning(false), 3000);
    } catch (error) {
      console.error("Error fetching data:", error);
      NProgress.done(); 

      setWarning(true);
      setWarntext('Error fetching data');
      setTimeout(() => setWarning(false), 3000);
    }

    finally {
      NProgress.done();
    }

  };

  // 📤 Send messages to all filtered receivers
  const handleSubmit = async () => {
    if (metric === '') {
      setWarning(true);
      setWarntext('select metric');
      setTimeout(() => setWarning(false), 3000);
      return;
    } else if (isNaN(parseInt(from)) || isNaN(parseInt(to))) {
      setWarning(true);
      setWarntext('Range should be integer');
      setTimeout(() => setWarning(false), 3000);
      return;
    } else if (parseInt(from) > parseInt(to)) {
      setWarning(true);
      setWarntext('give proper range');
      setTimeout(() => setWarning(false), 3000);
      return;
    } else if (text === '') {
      setWarning(true);
      setWarntext('add text');
      setTimeout(() => setWarning(false), 3000);
      return;
    }

    if (results.length === 0) {
      setWarning(true);
      setWarntext('No receivers found. Run filter first.');
      setTimeout(() => setWarning(false), 3000);
      return;
    }

    try {
      NProgress.start();
      const payload = results.map(row => ({
        sender: localStorage.getItem('user'),
        sender_code: "", // vacant
        sender_territory: decoded,
        receiver: row.Emp_Name,
        receiver_code: row.Emp_Code,
        receiver_territory: row.Territory,
        received_date: new Date().toISOString().split("T")[0],
        message: text,
        metric:metric
      }));

      const res = await fetch("https://review-backend-bgm.onrender.com/putInfo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Failed to send messages");

      setWarning(true);
       

      setWarntext('Messages delivered successfully');
      setTimeout(() => setWarning(false), 3000);

      // Reset form
      setText('');
      setMetric('');
      setFrom('');
      setTo('');
      setResults([]);
    } catch (err) {
      console.error("Error sending messages:", err);
      NProgress.done();
      setWarning(true);
      setWarntext('Error delivering messages');
      setTimeout(() => setWarning(false), 3000);
    }
    finally {NProgress.done(); }
  };

  return (
//     <div>
//       <div className="textarea-container">
//         <h3 style={{ textAlign: 'center' }}>Disclosure</h3>

//         {/* Metric dropdown */}
//         <div>
//           <label htmlFor="metric">Metric: </label>
//           <select
//             id="metric"
//             value={metric}
//             onChange={(e) => setMetric(e.target.value)}
//             style={{ borderRadius: '5px', marginLeft: '30px' }}
//           >
//             <option value="">Select a metric</option>
            
//             <option value="Calls">Calls</option>
//             <option value="Compliance">Compliance</option>
//             <option value="Coverage">Coverage</option>
//             <option value="Drs_Met">Doctors meet</option>
//           </select>
//         </div>

//         {/* Range inputs */}
//         <div style={{ display: 'flex', alignItems: 'center', marginTop: '15px' }}>
//           <p>From:</p>
//           <input
//             type="text"
//             value={from}
//             onChange={(e) => setFrom(e.target.value)}
//             style={{
//               width: '50px',
//               borderRadius: '5px',
//               marginLeft: '20px',
//               height: '25px'
//             }}
//           />
//           <p style={{ marginLeft: '30px' }}>To:</p>
//           <input
//             type="text"
//             value={to}
//             onChange={(e) => setTo(e.target.value)}
//             style={{
//               width: '50px',
//               borderRadius: '5px',
//               marginLeft: '20px',
//               height: '25px'
//             }}
//           />
//           <button
//             style={{
//               marginLeft: "15px",
//               background: "none",
//               border: "none",
//               color: 'black',
//               fontSize: "16px",
//               cursor: "pointer",
//               padding: 0
//             }}
//             onClick={showList}
//           >
//             <FontAwesomeIcon icon={faMagnifyingGlass} />
//           </button>
//         </div>

//         {/* Message input */}
//         <textarea
//           placeholder="send message"
//           value={text}
//           onChange={(e) => setText(e.target.value)}
//           className="custom-textarea"
//           style={{ marginTop: '10px' }}
//         />

//         <button onClick={handleSubmit} className="submit-button">
//           Submit
//         </button>

//         {/* Warnings */}
//         <div className="warning-container">
//          <p
//   className="warning-message"
//   style={{
//     visibility: warning ? 'visible' : 'hidden',
//     color: (
//       warntext === 'Messages delivered successfully' || 
//       warntext === 'Data fetched successfully below'
//     ) ? 'blue' : 'red'
//   }}
// >
//   {warntext || ''}
// </p>

//         </div>
//       </div>

//       {/* Preview results */}
//       {results.length > 0 && (
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "center",
//             marginTop: "20px",
//           }}
//         >
//           <div
//             style={{
//               width: "70%",
//               maxWidth: "800px",
//               maxHeight: "400px",
//               overflowY: "auto",
//               border: "1px solid #ccc",
//               borderRadius: "8px",
//               padding: "10px",
//               boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
//               backgroundColor: "white",
//             }}
//           >
//             <h4 style={{ textAlign: "center", marginBottom: "10px" }}>
//               {count} records found
//             </h4>
//             <table
//               border="1"
//               cellPadding="8"
//               style={{ width: "100%", borderCollapse: "collapse" }}
//             >
//               <thead style={{ backgroundColor: "#f2f2f2", position: "sticky", top: 0 }}>
//                 <tr>
//                   <th>Territory</th>
//                   <th>Emp Code</th>
//                   <th>Employee Name</th>
//                   <th>{metric}</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {results.map((row, idx) => (
//                   <tr key={idx}>
//                     <td>{row.Territory}</td>
//                     <td>{row.Emp_Code}</td>
//                     <td>{row.Emp_Name}</td>
//                     <td>{row[metric]}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}
//     </div>
<div style={{textAlign:'center',justifyContent:"center"}}><h1>Filtering Component</h1>will get updated soon</div>
  );
}

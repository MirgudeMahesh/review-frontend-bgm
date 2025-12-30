import React, { useState } from 'react';
import '../styles.css';
import { useLocation } from 'react-router-dom';
import NProgress from 'nprogress';
import { useRole } from './RoleContext';
import 'nprogress/nprogress.css'; 
import useEncodedTerritory from './hooks/useEncodedTerritory';
import useProfileTerritory from "./hooks/useProfileTerritory";
export default function Textarea() {
  const [text, setText] = useState('');
  const [target, setTarget] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [warning, setWarning] = useState(false);
  const [warntext, setWarntext] = useState('');
  const [metric, setMetric] = useState('');
    const location = useLocation();
     const { profileTerritory , profileEncodedTerritory } = useProfileTerritory();       

  
  const { role, userRole, name, setName } = useRole();
  // decode base64 -> original territory
  const {decoded} = useEncodedTerritory();
// Fetch Emp_Name from backend using territory (decoded)
const fetchEmpNameByTerritory = async () => {
  try {
    const res = await fetch(`https://review-backend-bgm.onrender.com/emp-name/${decoded}`);
    const data = await res.json();
    console.log("Fetched Emp Name:", data.Emp_Name);
    return data.Emp_Name || null;
  } catch (error) {
    console.error("Error fetching Emp Name:", error);
    return null;
  }
};

const handleSubmit = async () => {
  if (metric === '') {
    setWarning(true);
    setWarntext('Please select a metric');
    setTimeout(() => setWarning(false), 3000);
    return;
  } else if (text === '') {
    setWarning(true);
    setWarntext('Add text');
    setTimeout(() => setWarning(false), 3000);
    return;
  } else if (selectedDate === '') {
    setWarning(true);
    setWarntext('Please select a date');
    setTimeout(() => setWarning(false), 3000);
    return;
  } else {
    const [year, month] = selectedDate.split('-').map(Number);
    const lastDayOfMonth = new Date(year, month, 0);
    const today = new Date();

    if (lastDayOfMonth <= today) {
      setWarning(true);
      setWarntext('Date should be in the future');
      setTimeout(() => setWarning(false), 3000);
      return;
    }

   
    const goalDate = `${selectedDate}-${lastDayOfMonth
      .getDate()
      .toString()
      .padStart(2, '0')}`;

    // ⭐ NEW — Fetch Emp_Name for the sender
    const fetchedEmpName = await fetchEmpNameByTerritory();

    if (!fetchedEmpName) {
      setWarning(true);
      setWarntext('Unable to fetch sender name');
      setTimeout(() => setWarning(false), 3000);
      return;
    }

    const payload = {
      metric,
      sender: fetchedEmpName,                 // ⭐ updated
      sender_code: 'vacant',
      sender_territory: decoded,
      receiver: localStorage.getItem('name'),
      receiver_code: 'abc',
      receiver_territory: profileTerritory,
      goal: target,
      received_date: new Date().toISOString().split('T')[0],
      goal_date: goalDate,
      receiver_commit_date: '',
      commitment: text,
    };

    try {
      NProgress.start();
      await fetch('https://review-backend-bgm.onrender.com/putData', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      setWarning(true);
      setWarntext('Message delivered');
      setTarget('');
      setSelectedDate('');
      setText('');
      setMetric('');
      setTimeout(() => {
        setWarntext('');
        setWarning(false);
      }, 1000);
    } catch (error) {
      setWarning(true);
      setWarntext('Error sending data');
      setTimeout(() => setWarning(false), 3000);
    } finally {
      NProgress.done();
    }
  }
};
const metricOptions = [
  "Secondary Gr%",
  "MSR Achievement%",
  "RX Growth %",
  "Brand Performance Index",
  "Calls",
  "Coverage %",
  "Compliance %",
  "RCPA %",
  "Activity Implementation %"
];


const bmMetricOptions=[
  "Target Ach.",
  "Brand Mix (SP+P+E)",
  "Span of Performance",
  "% Rxer Growth",
  "% of Viable Territories",
  "Self Priority Customer Covg",
  "No of Calls - Self",
  "Team's Coverage",
  "Team's Compliance",
  "Marketing Implementation (inputs for >30 Days)",
  "% Tty MSP Compliance (vs Target)",
  "Dr. Conversion (Self Prio)",
  "% Tty MSR Compliance (vs Sec)",
  "Outstanding Days",
  "Sales Returns",
  "% spent of RBO & CA",
  "Closing Days"
]
const options =
  userRole === "BE"
    ? metricOptions
    : userRole === "BM"
    ? bmMetricOptions
    : [];

  return (
    <div className="escalating-container">
      <h3>
        Commitment
        <br />
        _____________________________________________
      </h3>

      <div className="form-group">
        <label htmlFor="metric">Metric:</label>
       <select
  id="metric"
  value={metric}
  onChange={(e) => setMetric(e.target.value)}
>
  <option value="">Select a metric</option>
  {options.map((item, index) => (
  <option key={index} value={item}>
    {item}
  </option>
))}
</select>

      </div>

      <textarea
        placeholder="Add commitment"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="custom-textarea"
      />

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginTop: '-10px',
          }}
        >
          <label htmlFor="date" style={{ fontWeight: '500' }}>
            Deadline:
          </label>
          <input
            type="month"
            id="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{
              padding: '6px',
              borderRadius: '6px',
              border: '1px solid #ccc',
              width: '70%',
              fontSize: '14px',
            }}
            min={new Date().toISOString().slice(0, 7)} // prevent selecting past months
          />
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginTop: '-10px',
          }}
        >
          <label htmlFor="target" style={{ fontWeight: '500' }}>
            Target:
          </label>
          <input
            id="target"
            placeholder="target..."
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            style={{
              padding: '6px 10px',
              borderRadius: '6px',
              border: '1px solid #ccc',
              width: '120px',
              fontSize: '14px',
            }}
          />
        </div>
      </div>

      <button onClick={handleSubmit} className="submit-button7">
        Submit
      </button>

      <div className="warning-container">
        <p
          className="warning-message"
          style={{
            visibility: warning ? 'visible' : 'hidden',
            color: warntext === 'Message delivered' ? 'blue' : 'red',
          }}
        >
          {warntext || ' '}
        </p>
      </div>
    </div>
  );
}

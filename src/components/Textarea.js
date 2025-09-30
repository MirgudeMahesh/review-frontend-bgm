import React, { useState } from 'react';
import '../styles.css';

export default function Textarea() {
  const [text, setText] = useState('');
  const [target, setTarget] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [warning, setWarning] = useState(false);
  const [warntext, setWarntext] = useState('');
  const [metric, setMetric] = useState('');

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
      // Calculate last day of selected month
      const [year, month] = selectedDate.split('-').map(Number);
      const lastDayOfMonth = new Date(year, month, 0); // 0 gives last day of previous month (so month index works)
      const today = new Date();

      if (lastDayOfMonth <= today) {
        setWarning(true);
        setWarntext('Date should be in the future');
        setTimeout(() => setWarning(false), 3000);
        return;
      }

      if (isNaN(parseInt(target))) {
        setWarning(true);
        setWarntext('Target should be integer');
        setTimeout(() => setWarning(false), 3000);
        return;
      }

      // Format last day as YYYY-MM-DD
      const goalDate = `${selectedDate}-${lastDayOfMonth
        .getDate()
        .toString()
        .padStart(2, '0')}`;

      const payload = {
        metric,
        sender: localStorage.getItem('user'),
        sender_code: localStorage.getItem('empcode'),
        sender_territory: localStorage.getItem('empterr'),
        receiver: localStorage.getItem('name'),
        receiver_code: 'abc', // placeholder
        receiver_territory: localStorage.getItem('territory'),
        goal: parseInt(target),
        received_date: new Date().toISOString().split('T')[0],
        goal_date: goalDate,
        receiver_commit_date: '',
        commitment: text,
      };

      try {
        await fetch('http://localhost:8000/putData', {
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
      }
    }
  };

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
          <option value="Efficiency">Efficiency</option>
          <option value="Performance">Performance</option>
          <option value="TeamBuild">TeamBuild</option>
          <option value="Hygine">Hygine</option>
          <option value="Compliance">Compliance</option>
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

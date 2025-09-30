import React, { useState } from 'react';
import '../styles.css' // optional if using separate CSS

export default function Escalating() {
  const [text, setText] = useState('');
  const [metric, setMetric] = useState('');
  const [warning, setWarning] = useState(false);
  const [warntext, setWarntext] = useState('');

  const handleSubmit =async () => {
    if (metric === '') {
      setWarning(true);
      setWarntext('Please select a metric');
      setTimeout(() => setWarning(false), 3000);
      return;
    }
 else if (text === '') {
      setWarning(true);
      setWarntext('Please add a message');
      setTimeout(() => setWarning(false), 3000);
      return;
    }
 else {
      console.log('pressed');
      const payload = {
        metric: metric,
        message: text,
        role: localStorage.getItem('role'),
        employee_name: localStorage.getItem('user'),
        territory_code: localStorage.getItem('empterr'),
        employee_code: localStorage.getItem('empcode'),

     
    
        entry_date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
       
        
      };
      // try {
        const response = await fetch('http://localhost:8000/putEscalations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        })
          .then(response => response.text())
          .then(result => {
            setWarning(true);
            setWarntext('Message delivered');
            
            setText('');
            setMetric('');
          });

        setTimeout(() => {
          setWarntext('');
          setWarning(false);
        }, 1000);




      


      return;
    }
    
    // setWarning(true);
    // setWarntext('Message delivered');
    // setTimeout(() => setWarning(false), 3000);
    // console.log("Submitted:", text);
    // console.log("Selected Metric:", metric);
    // setText('');
    // setMetric('');
  };

  return (
    <div className="escalating-container">
      <h3>Escalating<br/>___________________________________________</h3>

      <div className="form-group">
        <label htmlFor="metric" >Issue:</label>
        <select
          id="metric"
          value={metric}
          onChange={(e) => setMetric(e.target.value)} 
        >
          <option value="">Select a metric</option>
          <option value="Sales">Performance</option>
          <option value="Revenue">TeamBuild</option>
          <option value="Hygine">Hygine</option>
          <option value="Compliance">Compliance</option>
        </select>
      </div>

      <textarea
        placeholder="Enter your message"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="custom-textarea7"
      />

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
    {warntext || 'placeholder'}
  </p>
</div>

    </div>
  );
}

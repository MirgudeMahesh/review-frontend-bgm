import React, { useState, useRef, useEffect } from 'react';
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NProgress from 'nprogress';
import 'nprogress/nprogress.css'; 
import useEncodedTerritory from './hooks/useEncodedTerritory';
import '../styles.css';

export default function Filtering() {
  const [text, setText] = useState('');
  const [metric, setMetric] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [warning, setWarning] = useState(false);
  const [warntext, setWarntext] = useState('');
  const [results, setResults] = useState([]);
  const [count, setCount] = useState();
  const [shouldScrollToError, setShouldScrollToError] = useState(false);

  // Create refs for results section and warning notification
  const resultsRef = useRef(null);
  const warningRef = useRef(null);

  const { decoded } = useEncodedTerritory();

  // Auto-scroll to results when they appear
  useEffect(() => {
    if (results.length > 0 && resultsRef.current) {
      setTimeout(() => {
        resultsRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }, 100);
    }
  }, [results]);

  // Auto-scroll to error warnings from showList and handleSubmit
  useEffect(() => {
    if (warning && shouldScrollToError && warningRef.current) {
      setTimeout(() => {
        warningRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }, 100);
      setShouldScrollToError(false);
    }
  }, [warning, shouldScrollToError]);

  const showList = async () => {
    if (metric === '') {
      setWarning(true);
      setWarntext('Please select a metric');
      setShouldScrollToError(true);
      setTimeout(() => setWarning(false), 3000);
      return;
    } else if (isNaN(parseInt(from)) || isNaN(parseInt(to))) {
      setWarning(true);
      setWarntext('Range values must be numbers');
      setShouldScrollToError(true);
      setTimeout(() => setWarning(false), 3000);
      return;
    } else if (parseInt(from) > parseInt(to)) {
      setWarning(true);
      setWarntext('From value should be less than To value');
      setShouldScrollToError(true);
      setTimeout(() => setWarning(false), 3000);
      return;
    }
  
    try {
      NProgress.start();
      const response = await fetch("https://review-backend-bgm.onrender.com/filterData", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
      setShouldScrollToError(true); // ✅ FIXED: Always scroll for all warnings

      if (data.length === 0) {
        setWarntext('No records found in this range');
      } else {
        setWarntext(`Successfully found ${data.length} records`);
        setCount(data.length);
      }
      setTimeout(() => setWarning(false), 3000);
    } catch (error) {
      console.error("Error fetching data:", error);
      NProgress.done();
      setWarning(true);
      setWarntext('Failed to fetch data. Please try again.');
      setShouldScrollToError(true);
      setTimeout(() => setWarning(false), 3000);
    } finally {
      NProgress.done();
    }
  };

  const handleSubmit = async () => {
    if (metric === '') {
      setWarning(true);
      setWarntext('Please select a metric');
      setShouldScrollToError(true); // ✅ FIXED: Consistent scroll behavior
      setTimeout(() => setWarning(false), 3000);
      return;
    } else if (isNaN(parseInt(from)) || isNaN(parseInt(to))) {
      setWarning(true);
      setWarntext('Range values must be numbers');
      setShouldScrollToError(true); // ✅ FIXED: Consistent scroll behavior
      setTimeout(() => setWarning(false), 3000);
      return;
    } else if (parseInt(from) > parseInt(to)) {
      setWarning(true);
      setWarntext('From value should be less than To value');
      setShouldScrollToError(true); // ✅ FIXED: Consistent scroll behavior
      setTimeout(() => setWarning(false), 3000);
      return;
    } else if (text.trim() === '') {
      setWarning(true);
      setWarntext('Please enter a message');
      setShouldScrollToError(true); // ✅ FIXED: Consistent scroll behavior
      setTimeout(() => setWarning(false), 3000);
      return;
    }

    if (results.length === 0) {
      setWarning(true);
      setWarntext('No receivers found. Please search first.');
      setShouldScrollToError(true); // ✅ FIXED: Consistent scroll behavior
      setTimeout(() => setWarning(false), 3000);
      return;
    }

    try {
      NProgress.start();
      const payload = results.map(row => ({
        sender: localStorage.getItem('name'),
        sender_code: "",
        sender_territory: decoded,
        receiver: row.Emp_Name,
        receiver_code: row.Emp_Code,
        receiver_territory: row.Territory,
        received_date: new Date().toISOString().split("T")[0],
        message: text,
        metric: metric
      }));

      const res = await fetch("https://review-backend-bgm.onrender.com/putInfo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Failed to send messages");

      setWarning(true);
      setWarntext(`Messages sent successfully to ${results.length} recipients!`);
      setShouldScrollToError(true); // ✅ FIXED: Consistent scroll behavior
      setTimeout(() => setWarning(false), 3000);

      setText('');
      setMetric('');
      setFrom('');
      setTo('');
      setResults([]);
      setCount(0);
    } catch (err) {
      console.error("Error sending messages:", err);
      NProgress.done();
      setWarning(true);
      setWarntext('Failed to send messages. Please try again.');
      setShouldScrollToError(true); // ✅ FIXED: Consistent scroll behavior
      setTimeout(() => setWarning(false), 3000);
    } finally {
      NProgress.done();
    }
  };

  return (
    <div className="fltr__phoenix-wrapper-9x2z">
      <div className="fltr__disclosure-card-7k3m">
        <div className="fltr__header-section">
          <h2 className="fltr__heading-central-5w8q">Message Disclosure</h2>
          <p className="fltr__subtitle-text">Filter employees by metric range and send messages</p>
        </div>

        <form className="fltr__form-container" onSubmit={(e) => e.preventDefault()}>
          {/* Metric Selection */}
          <div className="fltr__form-group">
            <label htmlFor="metric" className="fltr__label-text">
              Select Metric <span className="fltr__required-mark">*</span>
            </label>
            <select
              id="metric"
              value={metric}
              onChange={(e) => setMetric(e.target.value)}
              className="fltr__dropdown-primary-8v2j"
            >
              <option value="">Choose a metric...</option>
              <option value="Doctor_Calls">Doctor Calls</option>
              <option value="Compliance">Compliance</option>
              <option value="Coverage">Coverage</option>
              <option value="Chemist_Met">Chemist Met</option>
            </select>
          </div>

          {/* Range Inputs */}
          <div className="fltr__range-group">
            <div className="fltr__form-group fltr__half-width">
              <label htmlFor="from" className="fltr__label-text">
                From <span className="fltr__required-mark">*</span>
              </label>
              <input
                id="from"
                type="number"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                placeholder="0"
                className="fltr__numeric-field-2h5w"
              />
            </div>
            <div className="fltr__form-group fltr__half-width">
              <label htmlFor="to" className="fltr__label-text">
                To <span className="fltr__required-mark">*</span>
              </label>
              <input
                id="to"
                type="number"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="100"
                className="fltr__numeric-field-2h5w"
              />
            </div>
          </div>

          {/* Search Button */}
          <button
            type="button"
            className="fltr__search-button"
            onClick={showList}
          >
            <FontAwesomeIcon icon={faMagnifyingGlass} className="fltr__icon-space" />
            Search Employees
          </button>

          {/* Message Input */}
          <div className="fltr__form-group">
            <label htmlFor="message" className="fltr__label-text">
              Message <span className="fltr__required-mark">*</span>
            </label>
            <textarea
              id="message"
              placeholder="Type your message here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="fltr__msgbox-elite-7q6n"
              rows="4"
            />
            <span className="fltr__helper-text">
              {text.length} characters
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            onClick={handleSubmit}
            className="fltr__submit-prime-4t9r"
            disabled={results.length === 0}
          >
            Send Messages
          </button>

          {/* Notification with ref */}
          {warning && (
            <div 
              ref={warningRef}
              className={`fltr__alert-box ${
                warntext.includes('Successfully') || warntext.includes('sent successfully')
                  ? 'fltr__alert-success'
                  : warntext.includes('No records')
                  ? 'fltr__alert-info'
                  : 'fltr__alert-error'
              }`}
            >
              <span className="fltr__alert-icon">
                {warntext.includes('Successfully') || warntext.includes('sent successfully') ? '✓' : 
                 warntext.includes('No records') ? 'ℹ' : '⚠'}
              </span>
              <span>{warntext}</span>
            </div>
          )}
        </form>
      </div>

      {/* Results Table with Ref */}
      {results.length > 0 && (
        <div className="fltr__results-arena-3k8m" ref={resultsRef}>
          <div className="fltr__data-showcase-2v7q">
            <div className="fltr__results-header">
              <h3 className="fltr__count-banner-9h4t">
                {count} {count === 1 ? 'Record' : 'Records'} Found
              </h3>
            </div>
            <div className="fltr__table-scroll-zone-5n2x">
              <table className="fltr__grid-display-8w3r">
                <thead>
                  <tr>
                    <th>Territory</th>
                    <th>Employee Code</th>
                    <th>Employee Name</th>
                    <th>{metric.replace('_', ' ')}</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((row, idx) => (
                    <tr key={idx}>
                      <td data-label="Territory">{row.Territory}</td>
                      <td data-label="Employee Code">{row.Emp_Code}</td>
                      <td data-label="Employee Name">{row.Emp_Name}</td>
                      <td data-label={metric.replace('_', ' ')}>{row[metric]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

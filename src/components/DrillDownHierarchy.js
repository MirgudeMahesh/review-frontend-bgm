import React, { useEffect, useState } from 'react';
import DrillDownTable from './DrillDownTable';
import NProgress from 'nprogress';
import { useLocation } from 'react-router-dom';
import 'nprogress/nprogress.css';
import useEncodedTerritory from './hooks/useEncodedTerritory';

const DrillDownHierarchy = () => {
  const [data, setData] = useState(null);
  const location = useLocation();

  // Decode base64 → original territory
  const { decoded } = useEncodedTerritory();
  const territory = decoded;

  // Checkbox state
  const [includeInactive, setIncludeInactive] = useState(false);

  useEffect(() => {
    if (!territory) return;

    NProgress.start();
    fetch(`https://review-backend-bgm.onrender.com/hierarchy`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ territory, includeInactive }) // send checkbox value
    })
      .then((res) => res.json())
      .then((actual) => setData(actual))
      .catch((err) => console.error(err))
      .finally(() => {
        NProgress.done();
      });

  }, [territory, includeInactive]); 
  // ⬆ re-fetch when checkbox changes

  return (
    <div
      style={{
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        border: '1px solid black',
        overflowY: 'scroll',
        height: '60vh',
        marginLeft: '0px',
        marginRight: '50px',
        marginTop: '-20px'
      }}
    >

      {/* Checkbox UI */}
      <div style={{ marginBottom: '10px' }}>
        <label>
          <input
            type="checkbox"
            checked={includeInactive}
            onChange={(e) => setIncludeInactive(e.target.checked)}
          />
          {' '}Include Inactive Employees
        </label>
      </div>

      {/* Display data */}
      {data ? (
        <DrillDownTable childrenData={data} level={1} />
      ) : (
        <p>Loading hierarchy...</p>
      )}

    </div>
  );
};

export default DrillDownHierarchy;

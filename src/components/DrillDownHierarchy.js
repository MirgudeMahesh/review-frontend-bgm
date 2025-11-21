import React, { useEffect, useState } from 'react';
import DrillDownTable from './DrillDownTable';
import NProgress from 'nprogress';
import { useLocation } from 'react-router-dom';
import 'nprogress/nprogress.css';
import useEncodedTerritory from './hooks/useEncodedTerritory';
const DrillDownHierarchy = () => {
  const [data, setData] = useState(null);
  // const territory = localStorage.getItem("empterr");
   const location = useLocation();

  // decode base64 -> original territory
  const {decoded} = useEncodedTerritory();
   // read territory from localStorage
const territory=decoded;
  useEffect(() => {
    if (!territory) return;
    NProgress.start();
    fetch(`https://review-backend-bgm.onrender.com/hierarchy`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ territory})
    })
      .then((res) => res.json())
      .then((actual) => setData(actual))
      .catch((err) => console.error(err)).finally(() => { NProgress.done(); });
  }, [territory]);

  return (
    <div
      style={{
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        border: '1px solid black',
        overflowY: 'scroll',
        height: '60vh',
        marginLeft: '50px',
        marginRight: '50px',
        marginTop: '100px'
      }}
    >
      {data ? (
        <DrillDownTable childrenData={data} level={1} />
      ) : (
        <p>Loading hierarchy...</p>
      )}
    </div>
  );
};

export default DrillDownHierarchy;

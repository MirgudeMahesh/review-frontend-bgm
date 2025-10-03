import React from 'react'
import Navbar from './Navbar'
import { useRole } from './RoleContext';
import { useState, useEffect } from 'react';
import ActualCommit from './ActualCommit';
import Subnavbar from './Subnavbar';
import Textarea from './Textarea';
import { useNavigate } from "react-router-dom";
import NProgress from 'nprogress';
import 'nprogress/nprogress.css'; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from '@fortawesome/free-solid-svg-icons';
export default function Commitment() {
 const navigate = useNavigate();
  const ec = localStorage.getItem("empByteCode"); // 👈 empByteCode


  const { role, setRole, name, setName } = useRole();
  const handleSubmit = (text) => {
    console.log("ABC Submitted:", text);

  };
           const terr=localStorage.getItem("empterr");
  const [beData, setBeData] = useState({
      Chemist_Calls: "",
      Compliance: "",
      Coverage: "",
      Calls: ""
    });

      const selection = (metric) => {
        NProgress.start();
    window.scrollTo({ top: 0, behavior: "smooth" });

    navigate(`/Selection?ec=${ec}&metric=${metric}`);
     NProgress.done();
  };
    const ClickableCell = ({ value, metric }) => (
    <span
      onClick={() => selection(metric)}
      style={{ cursor: "pointer", display: "inline-block" }}
    >
      {value}
    </span>
  );
    const HomePage = () => {
      NProgress.start();
      navigate(`/FinalReport?ec=${ec}`);
      NProgress.done();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    const HeadingWithHome = ({ level, children }) => {
      const HeadingTag = "h3"
      return (
        <div
          style={{
           display: "flex", justifyContent: "center", alignItems: "center", gap: "10px"
          }}
        >
          <HeadingTag style={{ margin: 0, textAlign: "center" }}>
            {children}
          </HeadingTag>
          <button
            style={{
             background: "none",
          border: "none",
          color: "black",
          fontSize: "16px",
          cursor: "pointer",
          padding: 0
            }}
            onClick={HomePage}
          >
            <FontAwesomeIcon icon={faHome} size='2x' />
          </button>
        </div>
      );
    };
  
  useEffect(() => {
    if (role && terr) {
      const fetchData = async () => {
        try {
          const response = await fetch("http://localhost:8000/hierarchy-kpi", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ empterr: terr })
          });
  
          const data = await response.json();
          if (response.ok && data[terr]) {
            // 👇 Pick BE/BM/BL node based on current territory
            const node = data[terr];
            setBeData({
              Chemist_Calls: node.metrics.Chemist_Calls || 0,
              Compliance: node.metrics.Compliance || 0,
              Coverage: node.metrics.Coverage || 0,
              Calls: node.metrics.Calls || 0
            });
          }
        } catch (err) {
          console.error("API error:", err);
        }
      };
  
      fetchData();
    }
  }, [role, terr]);
  
  return (
    <div>
    
      {(role === 'bm') ? (<div
        className='table-box'
      > 


        <ActualCommit />
      </div>) :

        ((
          <div className='table-box '>

<div className="table-container">
  {/* {name && <Subnavbar />} */}
                              <HeadingWithHome level="h3">Compliance & Reporting</HeadingWithHome>


  <table className="custom-table" style={{ fontSize: '12px' }}>
    <thead>
      <tr>
        <th>weightage</th>
        <th>Parameter</th>
        <th>Description</th>
        <th>Objective(%)</th>
        <th>Month Actual</th>
        <th>YTD(%)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>88</td>
        <td>TP Adherence Score</td>
        <td>% adherence to TP</td>
        <td>NA</td>
        <td>NA</td>
        <td>NA</td>
      </tr>
      <tr>
        <td>88</td>
        <td>Reporting Integrity Index</td>
        <td>Accuracy of SFA-reported data</td>
        <td>NA</td>
        <td>NA</td>
        <td>NA</td>
      </tr>
      <tr>
        <td>88</td>
        <td>SFPI</td>
        <td>Team's Customer Coverage</td>
        <td>NA</td>
        <td><ClickableCell value={beData.Coverage} metric="Coverage" /></td>
        <td>NA</td>
      </tr>
      <tr>
        <td>88</td>
        <td>SFPI</td>
        <td>Team's Customer Compliance</td>
        <td>NA</td>
        <td><ClickableCell value={beData.Compliance} metric="Compliance" /></td>
        <td>NA</td>
      </tr>
      <tr>
        <td>88</td>
        <td>MSPR Compliance</td>
        <td>% accuracy of MSP (for HQ) vs Objective taken cumulatively by BL</td>
        <td>NA</td>
        <td>NA</td>
        <td>NA</td>
      </tr>
      <tr>
        <td>88</td>
        <td>MSPR Compliance</td>
        <td>% of headquarters having MSR compliance with respect to Average Secondary Sales</td>
        <td>NA</td>
        <td>NA</td>
        <td>NA</td>
      </tr>
      <tr>
        <td>88</td>
        <td>NA</td>
        <td>NA</td>
        <td>NA</td>
        <td>NA</td>
        <td>NA</td>
      </tr>
      <tr className='shade'>
        <td>NA</td>
        <td>Compliance & Reporting Score</td>
        <td>NA</td>
        <td>NA</td>
        <td>NA</td>
        <td>NA</td>
      </tr>
    </tbody>
  </table>
  {/* {name && <Textarea onsubmit={handleSubmit} />} */}
</div>







          </div>))}
      {/* {role && name === '' && <ActualCommit />} */}
    </div>
  )
}

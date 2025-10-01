import React from 'react'
//----------------------------Team Build-----------------------------

import Textarea from '../Textarea';
import ActualCommit from '../ActualCommit';
 import { useRole } from '../RoleContext';
 import Subnavbar from '../Subnavbar';
import { useState, useEffect } from 'react';
 import '../../styles.css';
import Chats from './Chats';
 

export default function UserPerformance() {
 
  
         const { role,userRole,name, setName } = useRole();
         const terr=localStorage.getItem("territory");
const [beData, setBeData] = useState({
    Chemist_Calls: "",
    Compliance: "",
    Coverage: "",
    Calls: ""
  });

  const handleSubmit = (text) => {
    console.log("ABC Submitted:", 'performance');

  };
useEffect(() => {
  
  if (userRole && terr) {
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
}, [userRole, terr]);


  return (
    <div>
      {/* <Navbar />
   {name && <Subnavbar/>} */}
      <div
      className='table-box'
      >

        {userRole === 'BM' && (
         

<div className="table-container">
  {name && <Subnavbar />}
  <h3 style={{ textAlign: 'center' }}>Efforts and Effectiveness </h3>
  <table className="custom-table">
    <thead>
      <tr>
        <th>Parameter</th>
        <th>Objective(%)</th>
        <th>Month(%)</th>
        <th>YTD(%)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Self priority customer Cov</td>
        <td>NA</td>
        <td>{beData.Calls}</td>
        <td>NA</td>
      </tr>
      <tr>
        <td>Team's Coverage</td>
        <td>NA</td>
        <td>{beData.Coverage}</td>
        <td>NA</td>
      </tr>
      <tr>
        <td>Team's compliance</td>
        <td>NA</td>
        <td>{beData.Compliance}</td>
        <td>NA</td>
      </tr>
      <tr>
        <td>Mkting Impl(No inv &gt; 30 Days)</td>
        <td>NA</td>
        <td>NA</td>
        <td>NA</td>
      </tr>
      <tr>
        <td>Coaching days(No of BE X 5)</td>
        <td>NA</td>
        <td>NA</td>
        <td>NA</td>
      </tr>
      <tr>
        <td>Coaching days(No of BE X 5)</td>
        <td>NA</td>
        <td>NA</td>
        <td>NA</td>
      </tr>
      <tr>
        <td>MSP Compliance(Vs OBJ)</td>
        <td>NA</td>
        <td>NA</td>
        <td>NA</td>
      </tr>
      <tr>
        <td>TP Adherence Self & Team</td>
        <td>NA</td>
        <td>NA</td>
        <td>NA</td>
      </tr>
      <tr>
        <td>Coaching Score</td>
        <td>NA</td>
        <td>NA</td>
        <td>NA</td>
      </tr>
      <tr>
        <td>% Tty MSR Compliant(Vs Sec)</td>
        <td>NA</td>
        <td>NA</td>
        <td>NA</td>
      </tr>
      <tr>
        <td>No of Calls Self</td>
        <td>NA</td>
        <td>NA</td>
        <td>NA</td>
      </tr>
      <tr>
        <td>Self Learning Score</td>
        <td>NA</td>
        <td>NA</td>
        <td>NA</td>
      </tr>
      <tr>
        <td>Team Learning Score</td>
        <td>NA</td>
        <td>NA</td>
        <td>NA</td>
      </tr>
      <tr className='shade'>
        <td>Effort Score</td>
        <td>NA</td>
        <td>NA</td>
        <td>NA</td>
      </tr>
    </tbody>
  </table>
</div>


      

        )}
        {userRole === 'BL' && (
        

            <div className="table-container">
               {name && <Subnavbar/>}
              <h3 style={{ textAlign: 'center' }}>Team Building & Development</h3>

              <table className="custom-table">
                <thead>
                  <tr>
                    <th>weightage</th>
                    <th>Parameter</th>
                    <th>Description</th>
                    <th>Objective</th>
                    <th>Month Actual</th>
                    <th>YTD</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>15%</td> {/* ✅ Show role here */}
                    <td>Hiring Quality Index</td>
                    <td>% of proposed candidates Approved by BHR vs Submitted to BHR by BL</td>
                    <td>100%</td>
                    <td>33%</td>
                    <td>70%</td>
                  </tr>
                  <tr>
                    <td>0%</td> {/* ✅ Show role here */}
                    <td>Induction Score</td>
                    <td>*% of New Joinees Clearing induction in Pravesh</td>
                    <td>100%</td>
                    <td>33%</td>
                    <td>70%</td>
                  </tr>
                  <tr>
                    <td>15%</td> {/* ✅ Show role here */}
                    <td>Team Stability IndexI</td>
                    <td>*Infant attrition rate (within 180 days)</td>
                    <td>100%</td>
                    <td>33%</td>
                    <td>70%</td>
                  </tr>
                  <tr>
                    <td>0%</td> {/* ✅ Show role here */}
                    <td>Team Stability IndexI</td>
                    <td>*Avg. vacancy filling time (in days)</td>
                    <td>100%</td>
                    <td>33%</td>
                    <td>70%</td>
                  </tr>
                  <tr>
                    <td>0%</td> {/* ✅ Show role here */}
                    <td>Team Stability IndexI</td>
                    <td>Overall retention rate (Annual rate in current FY)</td>
                    <td>100%</td>
                    <td>33%</td>
                    <td>70%</td>
                  </tr>
                  <tr>
                    <td>0%</td> {/* ✅ Show role here */}
                    <td>Team Development Index</td>
                    <td>*% BM certification level change of L1, L2, L3 (10, 20,30 Points)</td>
                    <td>100%</td>
                    <td>33%</td>
                    <td>70%</td>
                  </tr>
                  <tr>
                    <td>0%</td> {/* ✅ Show role here */}
                    <td>Team Development Index</td>
                    <td>*% BE certification level change of L1, L2, L3 (10, 20,30 Points)</td>
                    <td>100%</td>
                    <td>33%</td>
                    <td>70%</td>
                  </tr>
                  <tr>
                    <td>0%</td> {/* ✅ Show role here */}
                    <td>Talent Pool Strength</td>
                    <td>*No. of pre-assesed internal candidates for promotion</td>
                    <td>100%</td>
                    <td>33%</td>
                    <td>70%</td>
                  </tr>
                  <tr>
                    <td>0%</td> {/* ✅ Show role here */}
                    <td>Talent Pool Strength</td>
                    <td>No of Candedates Data availabale for Vaccancies</td>
                    <td>100%</td>
                    <td>33%</td>
                    <td>70%</td>
                  </tr>
                  <tr className='shade'>
                    <td></td>
                    <td>Team Building Score</td>
                    <td></td><td></td>
                    <td></td>


                    <td>68%</td>
                  </tr>
                </tbody>
              </table>
             </div>

        

        )}

{(userRole === "BE" || userRole==='TE')&& (
 <div className="table-container">
  {name && <Subnavbar />}
  <h3 style={{ textAlign: "center" }}>Efforts and Effectiveness </h3>
  <table className="custom-table">
    <thead>
      <tr>
        <th>Parameter</th>
        <th>Objective(%)</th>
        <th>Month(%)</th>
        <th>YTD(%)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Calls</td>
        <td>NA</td>
        <td>{beData.Calls}</td>
        <td>NA</td>
      </tr>
      <tr>
        <td>Coverage</td>
        <td>NA</td>
        <td>{beData.Coverage}</td>
        <td>NA</td>
      </tr>
      <tr>
        <td>Compliance</td>
        <td>NA</td>
        <td>{beData.Compliance}</td>
        <td>NA</td>
      </tr>
      <tr>
        <td>Chemist_Calls</td>
        <td>NA</td>
        <td>{beData.Chemist_Calls}</td>
        <td>NA</td>
      </tr>
      <tr className="shade">
        <td>Effort Score</td>
        <td>NA</td>
        <td>NA</td>
        <td>NA</td>
      </tr>
    </tbody>
  </table>
</div>

)}


      </div>
       
    </div>
  )
}

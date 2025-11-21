import React from 'react'
import Navbar from '../Navbar'
import { useRole } from '../RoleContext';
import '../../styles.css';
import Chats from './Chats';

import ActualCommit from '../ActualCommit';
import Subnavbar from '../Subnavbar';
import Textarea from '../Textarea';

export default function UserCommitment() {
 



  const {userRole, setRole, name, setName } = useRole();
  const handleSubmit = (text) => {
    console.log("ABC Submitted:", text);

  };
  return (
    <div>
      
      {(userRole === 'BM') ? (<div
        className='table-box'
      >  {name && <Subnavbar />}


        <ActualCommit />
      </div>) :

        ((
          <div className='table-box '>

            <div className="table-container">
              {name && <Subnavbar />}
              <h3 style={{ textAlign: 'center' }}>Compliance & Reporting</h3>

              <table className="custom-table" style={{ fontSize: '12px', }}>
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
                    <td>73%</td>
                    <td>88</td><td>88</td>
                  </tr>
                  <tr>
                    <td>88</td>
                    <td>Reporting Integrity Index</td>
                    <td>Accuracy of SFA-reported data</td>
                    <td>73%</td>
                    <td>88</td><td>88</td>
                  </tr>
                  <tr>
                    <td>88</td>
                    <td>SFPI</td>
                    <td>Team's Customer Coverage</td>
                    <td>73%</td>
                    <td>88</td><td>88</td>
                  </tr>
                  <tr>
                    <td>88</td>
                    <td>SFPI</td>
                    <td>Team's Customer Compliance</td>
                    <td>73%</td>
                    <td>88</td><td>88</td>
                  </tr>
                  <tr>
                    <td>88</td>
                    <td>MSPR Compliance</td>
                    <td>% accuracy of MSP (for HQ) vs Objective taken cumulatively by BL</td>
                    <td>73%</td>
                    <td>88</td><td>88</td>
                  </tr>
                  <tr>
                    <td>88</td>
                    <td>MSPR Compliance</td>
                    <td>% of headquarters having MSR compliance with respect to Average Secondary Sales</td>
                    <td>73%</td>
                    <td>88</td><td>88</td>
                  </tr>
                  <tr>
                    <td>88</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td><td>88</td>
                  </tr>
                  <tr className='shade'>

                    <td></td>
                    <td>Compliance & Reporting Score</td>
                    <td>20</td>
                    <td></td>
                    <td></td><td>88</td>
                  </tr>
                </tbody>
              </table>
           

            </div>





          </div>))}
      {/* {role && name === '' && <ActualCommit />} */}
       
    </div>
  )
}

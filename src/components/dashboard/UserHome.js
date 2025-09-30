import React from 'react'

import '../../styles.css';
import { useState } from 'react';
import Chats from './Chats';

import Navbar from '../Navbar';
import Subnavbar from '../Subnavbar';
import ActualCommit from '../ActualCommit';
 import { useRole } from '../RoleContext';
import Textarea from '../Textarea';
const UserHome = () => {
  
     const { role,userRole,name, setName } = useRole();

  const handleSubmit = (text) => {
    console.log("ABC Submitted:", text);

  };
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
  

  return (

    <div>
      {/* <Navbar />
      {name && <Subnavbar/>} */}
      <div
        className='table-box'
      >

        {userRole === 'BM' && (
         


            <div className="table-container">
                {name && <Subnavbar/>}
              <h3 style={{ textAlign: 'center' }}>Bussiness Performance</h3>
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
    <td>Target Ach</td>
    <td>100%</td>
    <td>45</td>
    <td>88</td>
  </tr>
  <tr>
    <td>Secondary Gr%</td>
    <td>22</td>
    <td>77</td>
    <td>75</td>
  </tr>
  <tr>
    <td>Span of Performance</td>
    <td>23</td>
    <td>12</td>
    <td>92</td>
  </tr>
  <tr>
    <td>Dr.Conversion(Self Prio)</td>
    <td>20</td>
    <td>64</td>
    <td>81</td>
  </tr>
  <tr>
    <td>%Gr in Rxer</td>
    <td>24</td>
    <td>31</td>
    <td>68</td>
  </tr>
  <tr>
    <td>% of Viable Terr</td>
    <td>24</td>
    <td>89</td>
    <td>68</td>
  </tr>
  <tr className="shade">
    <td>Performance Score</td>
    <td>24</td>
    <td>56</td>
    <td>68</td>
  </tr>
</tbody>

              </table>
                


          </div>

        )}

        {userRole === 'BL' && (



          <div className="table-container">
             {name && <Subnavbar/>}
            <h3 style={{ textAlign: 'center' }}>Bussiness Performance</h3>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>weightage</th>
                  <th>Parameter</th>
                  <th>Description</th> <th>Objective(%)</th>
                  <th>Month Actual(%)</th>
                  <th>YTD(%)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>10%</td>
                  <td>Target / Objective Realization</td>
                  <td>Target achieved ≥100%</td>
                  <td>88</td><td>88</td><td>88</td>
                </tr>
                <tr>
                  <td>10%</td>
                  <td>Target / Objective Realization</td>
                  <td> % of Territories achieving ≥90% of Objective</td>
                  <td>88</td><td>88</td><td>88</td>
                </tr>
                <tr>
                  <td>10%</td>
                  <td>Corporate Customer Engagement & Conversion Score</td>
                  <td> % of corporate doctors visited/month (Out of 100 Selected)</td>
                  <td>88</td><td>88</td><td>88</td>
                </tr>
                <tr>
                  <td>10%</td>
                  <td>Corporate Customer Engagement & Conversion Score</td>
                  <td> % of Corporate doctors moved to active prescriber category </td>
                  <td>88</td><td>88</td><td>88</td>
                </tr>
                <tr>
                  <td>68</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>68</td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <td></td>
                <tr className='shade'>
                  <td></td>
                  <td>Performance Score</td>
                  <td>24</td>
                  <td></td>
                  <td></td>
                  <td>68</td>
                </tr>
              </tbody>
            </table>
       </div>



        )}

        {(userRole === 'BE'  || userRole ==='TE')&& (
         


            <div className="table-container">
                {name && <Subnavbar/>}
              <h3 style={{ textAlign: 'center' }}>Bussiness Performance</h3>
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
                    <td>Secondary Gr%</td>
                    <td>#N/A</td>
                    <td>#N/A</td>
                    <td>#N/A</td>
                  </tr>
                  <tr>
                    <td>MSR Acheivement%</td>
                    <td>100</td>
                    <td>#N/A</td>
                    <td>#N/A</td>
                  </tr>
                  <tr>
                    <td>%Gr in Rxer</td>
                    <td>5</td>
                    <td>#N/A</td>
                    <td>#N/A</td>
                  </tr>
                  <tr>
                    <td>Brand Perf. Index</td>
                    <td>100</td>
                    <td>#N/A</td>
                    <td>#N/A</td>
                  </tr>

                  <tr className='shade'>
                    <td>Performance Score</td>
                    <td>24</td>
                    <td>#N/A</td>
                    <td>68</td>
                  </tr>
                </tbody>
              </table>
      

          </div>

        )}



      </div>

    </div>
  )
}

export default UserHome;
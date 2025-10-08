import React from 'react'

import '../styles.css';
import { useState } from 'react';

import Navbar from './Navbar';
import Subnavbar from './Subnavbar';
import ActualCommit from './ActualCommit';
 import { useRole } from './RoleContext';
import Textarea from './Textarea';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css'; 
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from '@fortawesome/free-solid-svg-icons';
const Home = () => {
  const navigate = useNavigate();
     const { role,setRole } = useRole();

  const handleSubmit = (text) => {
    console.log("ABC Submitted:", text);

  };
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
  const ec= localStorage.getItem("empByteCode");
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

  return (

    <div>
      {/* <Navbar />
      // {name && <Subnavbar/>} */}
      <div
        className='table-box'
      >

        {role === 'bm' && (
         


            <div className="table-container">
                {/* {name && <Subnavbar/>} */}
                            <HeadingWithHome level="h1">Bussiness Performance</HeadingWithHome>

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
      <td>86</td>
      <td>88</td>
    </tr>
    <tr>
      <td>Secondary Gr%</td>
      <td>22</td>
      <td>71</td>
      <td>75</td>
    </tr>
    <tr>
      <td>Span of Performance</td>
      <td>23</td>
      <td>54</td>
      <td>92</td>
    </tr>
    <tr>
      <td>Dr.Conversion(Self Prio)</td>
      <td>20</td>
      <td>63</td>
      <td>81</td>
    </tr>
    <tr>
      <td>%Gr in Rxer</td>
      <td>24</td>
      <td>47</td>
      <td>68</td>
    </tr>
    <tr>
      <td>% of Viable Terr</td>
      <td>24</td>
      <td>79</td>
      <td>68</td>
    </tr>
    <tr className="shade">
      <td>Performance Score</td>
      <td>24</td>
      <td>91</td>
      <td>68</td>
    </tr>
  </tbody>
</table>

                {/* { name && < Textarea onsubmit={handleSubmit}/>} */}


          </div>

        )}
        {(role=== 'bh' || role==='sbuh') &&(
          <div className="table-container">
                              <HeadingWithHome level="h3">Bussiness and Brand Performance</HeadingWithHome>

  <table className="custom-table">
    <thead>
      <tr>
        <th>Parameter</th>
        <th>Description</th>
        <th>Objective</th>
        <th>Month</th>
        <th>YTD</th>
        <th>Month Val</th>
        <th>YTD Val</th>
        <th>Month</th>
        <th>YTD</th>
      </tr>
    </thead>

    <tbody>
      {/* Target / Objective Realization Section */}
      <tr>
        <td rowSpan="5">Target / Objective Realization</td>
        <td>% of Targets achieved ≥100%</td>
        <td>100%</td>
        <td >53%</td>
        <td >9%</td>
        <td>51.12/95.76</td>
        <td>27.43/305.4</td>
        <td>5.00%</td>
        <td>1.00%</td>
      </tr>

      <tr>
        <td>Brand Performance</td>
        <td>100%</td>
        <td >57%</td>
        <td >49%</td>
        <td>56.57/100</td>
        <td>56.57/100</td>
        <td>6.00%</td>
        <td>5.00%</td>
      </tr>

      <tr>
        <td>% of BMs achieving ≥90% of targets</td>
        <td>90%</td>
        <td >0%</td>
        <td >0%</td>
        <td>0/10</td>
        <td>0/10</td>
        <td>0.00%</td>
        <td>0.00%</td>
      </tr>

      <tr>
        <td>Span of Performance</td>
        <td>100%</td>
        <td >57%</td>
        <td >10%</td>
        <td>57.46/100</td>
        <td>10.31/100</td>
        <td>2.87%</td>
        <td>0.52%</td>
      </tr>

      <tr>
        <td># Viability of Terr</td>
        <td>100%</td>
        <td >13%</td>
        <td >0%</td>
        <td>7/54</td>
        <td>0/54</td>
        <td>5.00%</td>
        <td>5.00%</td>
      </tr>

      {/* Final Score Footer */}
      <tr className="shade">
        <td colSpan="2"><b>Compliance & Reporting Score</b></td>
        <td><b>35%</b></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td><b>18.87%</b></td>
        <td><b>11.52%</b></td>
      </tr>
    </tbody>
  </table>
</div>

        )

        }

        {role === 'bl' && (



          <div className="table-container">
             {/* {name && <Subnavbar/>} */}
                            <HeadingWithHome level="h1">Bussiness Performance</HeadingWithHome>
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
 {/* { name && < Textarea onsubmit={handleSubmit}/>}     */}
       </div>



        )}

        {(role === 'be' ) && (
         


            <div className="table-container">
                {/* {name && <Subnavbar/>} */}
                            <HeadingWithHome level="h1">Bussiness Performance</HeadingWithHome>
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
              {/* { name && < Textarea onsubmit={handleSubmit}/>} */}

          </div>

        )}



      </div>

    </div>
  )
}

export default Home;
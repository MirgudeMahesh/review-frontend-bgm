import React from 'react'
import Navbar from './Navbar';
// ------------------------Hygine---------------------

import ActualCommit from './ActualCommit';
import Textarea from './Textarea';
import Subnavbar from './Subnavbar';
import { useRole } from './RoleContext';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css'; 
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from '@fortawesome/free-solid-svg-icons';
export default function Miscfiles() {
const navigate = useNavigate();
  const { role, setRole, name, setName } = useRole();

  const handleSubmit = (text) => {
    console.log("ABC Submitted:", text);

  };
   const ec= localStorage.getItem("empByteCode");
    const HomePage = () => {
      NProgress.start();
      navigate(`/FinalReport?ec=${ec}`);
      NProgress.done();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    const HeadingWithHome = ({ level, children }) => {
      const HeadingTag =  "h3";
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
                              <HeadingWithHome level="h1">Hygiene</HeadingWithHome>

            <table className="custom-table">
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>Objective(%)</th>
                  <th>Month</th>
                  <th>YTD(%)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{role}</td>
                  <td>100%</td>
                  <td>73%</td>
                  <td>88</td>
                </tr>
                <tr>
                  <td>RBO Cost</td>
                  <td>22</td>
                  <td>57%</td>
                  <td>75</td>
                </tr>
                <tr>
                  <td>Receivables</td>
                  <td>23</td>
                  <td>45%</td>
                  <td>92</td>
                </tr>
                <tr>
                  <td>Returns</td>
                  <td>20</td>
                  <td>67%</td>
                  <td>81</td>
                </tr>
                <tr>
                  <td>Closing Stock</td>
                  <td>20</td>
                  <td>89%</td>
                  <td>81</td>
                </tr>
                <tr className='shade'>
                  <td>Hygiene Score</td>
                  <td>24</td>
                  <td>78%</td>
                  <td>68</td>
                </tr>
              </tbody>
            </table>
            {/* {name && < Textarea onsubmit={handleSubmit} />} */}

          </div>



        )}
        {role === 'bl' && (
          <div className="table-container"  >
            {/* {name && <Subnavbar/>} */}
                                          <HeadingWithHome level="h1">Business Hygiene & Demand Quality</HeadingWithHome>


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
                  <td>Return Ratio</td>
                  <td>% of Returns as % of secondary sales (Objective 2%) </td>
                  <td>73%</td>
                  <td>88</td><td>88</td>
                </tr>
                <tr>
                  <td>88</td>
                  <td>Outstanding Days</td>
                  <td>DSO (days Sales Outstanding) per zone 30</td>
                  <td>73%</td>
                  <td>88</td><td></td>
                </tr>
                <tr>
                  <td>88</td>
                  <td>Push-to-Pull Ratio</td>
                  <td>% business driven by schemes vs organic sales 30%</td>
                  <td>73%</td>
                  <td>88</td><td>88</td>
                </tr>
                <tr>
                  <td>88</td>
                  <td>Closing Stock Index</td>
                  <td>*Avg. closing stock in days (should be ≤30days)</td>
                  <td>73%</td>
                  <td>88</td><td></td>
                </tr>
                <tr>
                  <td>88</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td><td></td>
                </tr>
                <tr>
                  <td>88</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td><td></td>
                </tr>
                <tr>
                  <td>88</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td><td></td>
                </tr><tr>
                  <td>88</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td><td></td>
                </tr><tr>
                  <td>88</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td><td></td>
                </tr>
                <tr className='shade'>

                  <td></td>
                  <td>Performance Score</td>
                  <td></td>
                  <td>20</td>
                  <td></td><td>88</td>
                </tr>
              </tbody>
            </table>
             {/* {name && < Textarea onsubmit={handleSubmit} />} */}
          </div>

        )}


      </div>
      {/* {role && name === '' && <ActualCommit />} */}
    </div>
  )
}

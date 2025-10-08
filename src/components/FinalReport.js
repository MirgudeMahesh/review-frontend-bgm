import React, { useState } from 'react';
import Navbar from './Navbar';
import ActualCommit from './ActualCommit';
import Textarea from './Textarea';
import { useRole } from './RoleContext';
import Subnavbar from './Subnavbar';
import { useNavigate } from 'react-router-dom';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css'; 
export default function FinalReport() {
  const { role, setRole, name, setName } = useRole();
  const [selectedDate, setSelectedDate] = useState('');
   const ec=localStorage.getItem("empByteCode");
    const navigate = useNavigate();

  const perform = () => { 
    NProgress.start();
    navigate(`/TeamBuild?ec=${ec}`); 
     NProgress.done();
     
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  };

  const Home = () => { 
        NProgress.start();

    navigate(`/Performance?ec=${ec}`); 
          NProgress.done();
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  };



  const misc = () => {
        NProgress.start();
 
    navigate(`/Hygine?ec=${ec}`); 
               NProgress.done();

    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  };

  const commitment = () => {
              NProgress.start();

 
    navigate(`/Compliance?ec=${ec}`); 
           NProgress.done();
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  };

  return (
    <div>
      {/* <Navbar /> */}

      <div className="table-box">
        {(role === 'be' ) && (
          <div className="table-container">
            {/* {name && <Subnavbar />} */}
            <h3 style={{ textAlign: 'center' }}>Efficiency Index</h3>

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
                  <td onClick={() => perform()}>Team Building and Development</td>
                  <td>100%</td>
                  <td>#REF!</td>
                  <td>88</td>
                </tr>
                <tr>
                  <td onClick={() => Home()}>Business Performance</td>
                  <td>22</td>
                  <td>57%</td>
                  <td>75</td>
                </tr>
               
          
                <tr className="shade">
                  <td>Efficiency Index</td>
                  <td>24</td>
                  <td>#REF!</td>
                  <td>68</td>
                </tr>
              </tbody>
            </table>

            {/* {name && <Textarea onsubmit={handleSubmit} />} */}
          </div>
        )}
      {  (role ==='bh' || role==='sbuh') &&(
          <div className="table-container">
  <h3 style={{ textAlign: 'center' }}>Efficiency Index</h3>

  <table className="custom-table">
    <thead>
      <tr>
        <th>Parameter</th>
        <th>Objective</th>
        <th>Month</th>
        <th>YTD</th>
      </tr>
    </thead>

    <tbody>
      <tr>
        <td onClick={() => perform()}>Team &amp; Culture Building </td>
        <td>25%</td>
        <td >18%</td>
        <td >12%</td>
      </tr>

      <tr>
        <td onClick={() => Home()}>Business &amp; Brand Performance </td>
        <td>35%</td>
        <td >19%</td>
        <td >12%</td>
      </tr>

      <tr>
        <td onClick={() => commitment()}>Activity &amp; Productivity</td>
        <td>20%</td>
        <td >13%</td>
        <td >12%</td>
      </tr>

      <tr>
        <td onClick={() => misc()}>Business Hygiene &amp; Demand Quality</td>
        <td>20%</td>
        <td >16%</td>
        <td >-132%</td>
      </tr>

      <tr className="shade">
        <td><b>Efficiency Index</b></td>
        <td><b>100%</b></td>
        <td><b>66.30%</b></td>
        <td><b>-96.64%</b></td>
      </tr>
    </tbody>
  </table>
</div>

        )}

        {role === 'bm' && (
          <div className="table-container">
            {/* {name && <Subnavbar />} */}
            <h3 style={{ textAlign: 'center' }}>Efficiency Index</h3>

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
                  <td onClick={() => perform()}>Team Building and Development</td>
                  <td>100%</td>
                  <td>#REF!</td>
                  <td>88</td>
                </tr>
                <tr>
                  <td onClick={() => Home()}>Business Performance</td>
                  <td>22</td>
                  <td>57%</td>
                  <td>75</td>
                </tr>
              
                <tr>
                  <td onClick={() => misc()}>Business Hygiene and Demand Quality</td>
                  <td>20</td>
                  <td>#REF!</td>
                  <td>81</td>
                </tr>
                <tr className="shade">
                  <td>Efficiency Index</td>
                  <td>24</td>
                  <td>#REF!</td>
                  <td>68</td>
                </tr>
              </tbody>
            </table>

            {/* {name && <Textarea onsubmit={handleSubmit} />} */}
          </div>
        )}

        {role === 'bl' && (
          <div className="table-container">
            {/* {name && <Subnavbar />} */}
            <h3 style={{ textAlign: 'center' }}>Efficiency Index</h3>

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
                  <td onClick={() => perform()}>Team Building and Development</td>
                  <td>100%</td>
                  <td>#REF!</td>
                  <td>88</td>
                </tr>
                <tr>
                  <td onClick={() => Home()}>Business Performance</td>
                  <td>22</td>
                  <td>57%</td>
                  <td>75</td>
                </tr>
                <tr>
                  <td onClick={() => commitment()}>Compliance and Reporting</td>
                  <td>23</td>
                  <td>#REF!</td>
                  <td>92</td>
                </tr>
                <tr>
                  <td onClick={() => misc()}>Business Hygiene and Demand Quality</td>
                  <td>20</td>
                  <td>#REF!</td>
                  <td>81</td>
                </tr>
                <tr className="shade">
                  <td>Efficiency Index</td>
                  <td>24</td>
                  <td>#REF!</td>
                  <td>68</td>
                </tr>
              </tbody>
            </table>

            {/* {name && <Textarea onsubmit={handleSubmit} />} */}

          
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import Navbar from '../Navbar';
import ActualCommit from '../ActualCommit';
import Chats from './Chats';
import Textarea from '../Textarea';
import { useRole } from '../RoleContext';
import Subnavbar from '../Subnavbar';
import '../../styles.css';
export default function UserFinalReport() {
  const { userRole,role, setRole, name, setName } = useRole();
  const [selectedDate, setSelectedDate] = useState('');

 
 const handleSubmit = ({ text, selectedDate,warning,warntext,setWarning,setWarntext }) => {
  if(text===''){ setWarning(true);
         setWarntext('add text ')
      setTimeout(() => setWarning(false), 3000); // hide after 3 seconds
      
      return;
    }

  console.log("Submitted:", text);
  console.log("Selected Date:", selectedDate);
};
  return (
    <div>


      <div className="table-box">
        {(userRole === 'BE' ) && (
          <div className="table-container">
            {name && <Subnavbar />}
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
                  <td>Team Building and Development</td>
                  <td>100%</td>
                  <td>#REF!</td>
                  <td>88</td>
                </tr>
                <tr>
                  <td>Business Performance</td>
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

         
          </div>
        )}

        {userRole === 'BM' && (
          <div className="table-container">
            {name && <Subnavbar />}
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
                  <td>Team Building and Development</td>
                  <td>100%</td>
                  <td>#REF!</td>
                  <td>88</td>
                </tr>
                <tr>
                  <td>Business Performance</td>
                  <td>22</td>
                  <td>57%</td>
                  <td>75</td>
                </tr>
              
                <tr>
                  <td>Business Hygiene and Demand Quality</td>
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

       
          </div>
        )}

        {userRole === 'BL' && (
          <div className="table-container">
            {name && <Subnavbar />}
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
                  <td>Team Building and Development</td>
                  <td>100%</td>
                  <td>#REF!</td>
                  <td>88</td>
                </tr>
                <tr>
                  <td>Business Performance</td>
                  <td>22</td>
                  <td>57%</td>
                  <td>75</td>
                </tr>
                <tr>
                  <td>Compliance and Reporting</td>
                  <td>23</td>
                  <td>#REF!</td>
                  <td>92</td>
                </tr>
                <tr>
                  <td>Business Hygiene and Demand Quality</td>
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


          
          </div>
        )}
      </div>
    
    </div>
  );
}

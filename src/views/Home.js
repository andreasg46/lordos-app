import React, { useEffect, useState } from 'react'
import {
  CBadge,
  CCard,
} from '@coreui/react-pro'
import { CheckSession } from '../services/Auth'
import { cilBell } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { findOtherUsers, findOtherUsersAnswered } from 'src/services/APIs';
import { getCookie } from 'src/services/Cookies';
import { AppLoader } from 'src/components/app/AppLoader';
import { phase_A_time, phase_B_time, phase_C_time } from 'src/config/globals';

const Home = () => {
  CheckSession();

  const [loader, setLoader] = useState(true);

  const [otherUsers, setOtherUsers] = useState([]);
  const [pendingPhaseText, setPendingPhaseText] = useState('N/A');
  let previousPhase = 'N/A';

  let today = new Date().toISOString().slice(0, 10);
  const tmp = new Date(today);
  tmp.setDate(tmp.getDate() + 1);
  let tomorrow = new Date(tmp).toISOString().slice(0, 10);

  const GetPhase = () => {
    let time = new Date().getUTCHours() + 3;

    if (time >= phase_A_time.slice(0, 2) && time < phase_B_time.slice(0, 2)) {
      previousPhase = 'A';
      setPendingPhaseText('B starts at ' + phase_B_time);
    } else if (time >= phase_B_time.slice(0, 2) && time < phase_C_time.slice(0, 2)) {
      previousPhase = 'B';
      setPendingPhaseText('C starts at ' + phase_C_time);
    } else {
      previousPhase = 'C'; // from 18:00 till 09:00 
      setPendingPhaseText('A starts at ' + phase_A_time);
    }
  }

  useEffect(() => {
    window.history.pushState(null, null, null);

    window.addEventListener('popstate', () => {
      window.history.pushState(null, null, null);
      alert("If you go back to the previous page, please back from the return to the previous button.");
    });

    GetPhase();

    let tmpOtherUsers = [];
    Promise.resolve(findOtherUsers(getCookie('session_id'), getCookie('code')))
      .then(value1 => {
        tmpOtherUsers = value1 || [];
        for (let i = 0; i < tmpOtherUsers.length; i++) {
          tmpOtherUsers[i]['answered'] = false;
        }
        Promise.resolve(findOtherUsersAnswered(getCookie('session_id'), getCookie('code'), previousPhase, today, tomorrow))
          .then(value2 => {
            value1.map((user, index) => {
              value2.map((answer) => {
                if (user.code === answer.code) {
                  tmpOtherUsers[index]['answered'] = true;
                }
              })
            })
            setOtherUsers(tmpOtherUsers);
            setLoader(false);
          });
      });
  }, []);


  return (
    <>
      <div className="center" style={{ display: loader ? 'none' : 'block' }}>
        <div className='home-card' >
          <CCard style={{ backgroundColor: 'rgba(0,0,0,0.8)', padding: '30px 18px' }}>
            <h1 style={{ color: 'white' }}>Thank you for participating in Lordos Application!</h1>
            <hr style={{ height: '4px', background: '#9ef1e2' }} />
            <p style={{ color: 'white', padding: '0', marginBottom: '0' }}>Pending: <CBadge color='warning-gradient'>Phase {pendingPhaseText}</CBadge></p>
            <hr style={{ height: '4px', background: '#9ef1e2' }} />
            <p style={{ color: 'white', padding: '0', marginBottom: '0' }}>Previous phase completed:</p>
            {otherUsers.map((user, index) => {
              return (
                <div key={index}>
                  <p style={{ color: 'white', padding: '0', marginBottom: '0' }}>
                    <CBadge color={user.answered ? 'success-gradient' : 'danger-gradient'}>
                      User {user.code} has {user.answered ? 'completed' : 'not completed'} previous phase
                    </CBadge>


                  </p>
                </div>
              )
            })}

            <hr style={{ height: '4px', background: '#9ef1e2' }} />
            <p style={{ color: 'white', padding: '0' }}>You will receive a push notification when new questions are available <CIcon icon={cilBell} /></p>
          </CCard>
        </div >
      </div>
      <div style={{ display: (loader ? 'block' : 'none') }}>
        <AppLoader />
      </div>
    </>
  )
}

export default Home

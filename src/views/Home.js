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

const Home = () => {
  CheckSession();

  const [otherUsers, setOtherUsers] = useState([]);

  const [pendingPhaseText, setPendingPhaseText] = useState('N/A');
  let previousPhase = 'N/A';

  let today = new Date().toISOString().slice(0, 10);
  const tmp = new Date(today);
  tmp.setDate(tmp.getDate() + 1);
  let tomorrow = new Date(tmp).toISOString().slice(0, 10);

  const GetPhase = () => {
    let time = new Date().getUTCHours() + 3;
    if (time > 8 && time < 14) { // from 09:00 till 14:00 
      previousPhase = 'A';
      setPendingPhaseText('B starts at 14:00');
    } else if (time >= 14 && time < 18) { // from 14:00 till 18:00 
      previousPhase = 'B';
      setPendingPhaseText('C starts at 18:00');
    } else {
      previousPhase = 'C'; // from 18:00 till 09:00 
      setPendingPhaseText('A starts at 09:00');
    }
  }

  useEffect(() => {
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
          });
      });

  }, []);


  return (
    <>
      <div className="center">
        <div className='home-card'>
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
    </>
  )
}

export default Home

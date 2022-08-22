import React from 'react'
import {
  CBadge,
  CCard,
} from '@coreui/react-pro'
import { cilBell } from '@coreui/icons';
import CIcon from '@coreui/icons-react';

export const HomeCard = (props) => {

  return (
    <>
      <CCard style={{ backgroundColor: 'rgba(0,0,0,0.8)', padding: '30px 18px' }}>
        <h1 style={{ color: 'white' }}>Thank you for participating in Lordos Application!</h1>
        <hr style={{ height: '4px', background: '#9ef1e2' }} />
        <p style={{ color: 'white', padding: '0', marginBottom: '0' }}>Pending: <CBadge color='warning-gradient'>Phase {props.pendingPhaseText}</CBadge></p>
        <hr style={{ height: '4px', background: '#9ef1e2' }} />
        <p style={{ color: 'white', padding: '0', marginBottom: '0' }}>Previous phase completed:</p>
        {props.otherUsers.map((user, index) => {
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
    </>
  )
}
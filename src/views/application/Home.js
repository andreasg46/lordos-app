import React from 'react'
import {
  CCard,
} from '@coreui/react-pro'
import { CheckSession } from './functions/general'
import { cilBell } from '@coreui/icons';
import CIcon from '@coreui/icons-react';

const Home = () => {
  CheckSession();
  return (
    <>
      <div className="center">
        <div className='home-card'>
          <CCard style={{ backgroundColor: 'rgba(0,0,0,0.5)', padding: '120px 18px' }}>
            <h1 style={{ color: 'white' }}>Thank you for participating in Lordos Application!</h1>
            <hr style={{ height: '4px', background: '#9ef1e2' }} />
            <p style={{ color: 'white', padding: '0' }}>You will receive a push notification when questions are available <CIcon icon={cilBell} /></p>
          </CCard>
        </div >
      </div>
    </>
  )
}

export default Home

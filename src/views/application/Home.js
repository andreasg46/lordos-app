import React from 'react'
import {
  CCard,
  CCardFooter,
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
          <CCard style={{ backgroundColor: 'rgba(0,0,0,0.5)', padding: '120px 20px' }}>
            <h1 style={{ color: 'white' }}>Thank you for joining Lordos Application!</h1>
            <CCardFooter style={{ padding: '10px 0px 0 0' }}>
              <p style={{ color: 'white', padding: '0' }}>You will receive a push notification when a question is available <CIcon icon={cilBell} /></p>
            </CCardFooter>
          </CCard>
        </div >
      </div>
    </>
  )
}

export default Home

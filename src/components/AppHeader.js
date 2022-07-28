import React from 'react'
import {
  CButton,
  CCol,
  CContainer,
  CHeader,
  CImage,

} from '@coreui/react-pro'

import { useNavigate } from 'react-router-dom';
import { AppHeaderInfo } from './header/AppHeaderInfo';

const AppHeader = () => {
  const navigate = useNavigate();

  return (
    <CHeader className="mb-4">
      <CContainer fluid>
        <CCol xs={3}>
          <CImage src='logo.png' height={80} />
        </CCol>

        <CCol xs={9} style={{ textAlign: 'end' }}>
          <div style={{ textAlign: 'end', padding: '0px' }}>
            <AppHeaderInfo session_id='1' user_code='1003' session_status='Pending' />
            <CButton color='success' variant='outline'
              onClick={() => {
                navigate('/landing');
              }}
            >Join new session</CButton>
          </div>

        </CCol>

      </CContainer>

    </CHeader>
  )
}

export default AppHeader

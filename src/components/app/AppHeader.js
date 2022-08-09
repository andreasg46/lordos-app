import React from 'react'
import {
  CButton,
  CCol,
  CContainer,
  CHeader,
  CHeaderDivider,
  CImage
} from '@coreui/react-pro'
import { useNavigate } from 'react-router-dom';
import { AppHeaderInfo } from './header/AppHeaderInfo';
import { getCookie } from 'src/services/Cookies';

const AppHeader = () => {
  const navigate = useNavigate();

  return (
    <>
      <CHeader className="mb-4">
        <CContainer fluid>
          <CCol xs={3}>
            <CImage src='logo.png' height={80}
              onClick={() => {
                navigate('/home');
              }} />
          </CCol>

          <CCol xs={7} style={{ textAlign: 'end' }}>
            <div style={{ textAlign: 'end', padding: '0px' }}>
              <CButton color='success' variant='outline'
                onClick={() => {
                  navigate('/landing');
                }}
              >Join new session</CButton>
            </div>
          </CCol>
        </CContainer>
        <CHeaderDivider /><AppHeaderInfo session_id={getCookie('session_id')} user_code={getCookie('code')} user_role={getCookie('role')} session_status={getCookie('status')} /><CHeaderDivider />
      </CHeader>

    </>
  )
}

export default AppHeader

import React from 'react'
import PropTypes from "prop-types";
import CIcon from '@coreui/icons-react';
import { cisCircle } from '@coreui/icons-pro';
import { CCol } from '@coreui/react-pro';

const GetStatus = session_status => {
  switch (session_status) {
    case 'Active':
      return '#2eb85c'
    case 'Pending':
      return '#f9b115'
    case 'Inactive':
      return '#e55353'
    default:
      return '#39f';
  }
}

export const AppHeaderInfo = ({ session_id, user_code, session_status }) => {
  return (
    <>
      <CCol className='header-info-col'>
        <p className='header-title'>Session ID: <strong>{session_id}</strong> | User Code: <strong>{user_code}</strong> | Status: <CIcon icon={cisCircle} style={{ color: GetStatus(session_status), border: '3px solid #babcbc', borderRadius: '50px' }} /></p>
      </CCol>
    </>
  )
}

// AppHeaderInfo.propTypes = {
//   session_id: PropTypes.string.isRequired,
//   user_code: PropTypes.string.isRequired,
//   session_status: PropTypes.string
// };

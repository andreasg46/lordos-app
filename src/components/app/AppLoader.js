import React from 'react'
import {
  CCard,
  CCol,
  CRow,
  CSpinner,
} from '@coreui/react-pro'

export const AppLoader = () => {

  return (
    <>
      <div className="center">
        <CCard className='loader-card'>
          <CRow className="justify-content-center">
            <CCol md={12}>
              <CSpinner variant='grow' color='light' />
            </CCol>
          </CRow>
        </CCard >
      </div>
    </>
  )
}

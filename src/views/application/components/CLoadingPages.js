import React from 'react'
import {
  CCol,
  CContainer,
  CImage,
  CRow,
  CSpinner,
} from '@coreui/react-pro'

export const CLoadingPages = () => {

  return (
    <>
      <div className="center">
        <div className='home-card'>
          <CRow className="justify-content-center">
            <CCol md={12}>
              <CSpinner variant='grow' color='dark' />
            </CCol>
          </CRow>
        </div >
      </div>
    </>
  )
}

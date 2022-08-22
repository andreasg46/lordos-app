import React from 'react'
import { AppLoader } from 'src/components/app/AppLoader';
import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CFormCheck,
} from '@coreui/react-pro'
import CIcon from '@coreui/icons-react'
import { cilArrowCircleRight, cilCheckCircle } from '@coreui/icons'

const Questions = (props) => {

  return (
    <>
      <div className='questions-center'>
        <div style={props.loader ? { display: 'none' } : { display: 'block' }} className='questions-card' >
          <CCol md={12}>
            <CCard md={12}>
              <CCardHeader>
                <small><em>Phase {props.phase}</em></small> <strong>Question {props.index}</strong><span className='float-end'><strong>{props.index}/{props.total}</strong></span>

              </CCardHeader>
              <CCardBody>
                <p style={{ fontSize: 'large' }}><em>{props.title}</em></p>
                {props.options.map((option, index) => {
                  return (
                    <div key={index}>
                      <CButton className='question-card' style={{ cursor: 'initial' }}>
                        <CFormCheck className='question-checkbox' id={option} value={option} key={option} label={option} onChange={props.handleSelect} />
                      </CButton>
                    </div>
                  )
                })}
              </CCardBody>
              <CCardFooter>
                <CButton
                  style={{ width: '48%' }}
                  color='primary'
                  variant='outline'
                  onClick={props.nextQuestion}
                >Next <CIcon icon={cilArrowCircleRight} /></CButton>
                <CButton
                  style={{ width: '48%' }}
                  color='success'
                  variant='outline'
                  className='float-end'
                  onClick={props.submitAnswer}
                >Submit <CIcon icon={cilCheckCircle} /></CButton>
              </CCardFooter>
            </CCard >
          </CCol>
        </div>
        <div style={props.loader ? { display: 'block' } : { display: 'none' }}  >
          <AppLoader />
        </div>
      </div>
    </>
  )
}

export default Questions

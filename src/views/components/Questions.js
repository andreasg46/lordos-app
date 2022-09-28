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
import { cilArrowCircleLeft, cilArrowCircleRight } from '@coreui/icons'

const Questions = (props) => {

  console.log(props.options);
  return (
    <>

      <div className='questions-center'>
        <div style={props.loader ? { display: 'none' } : { display: 'block' }} className='questions-card' >
          <CCol md={12}>
            <CCard md={12}>
              <CCardHeader>
                <strong>Question {props.index + 1}</strong><span className='float-end'><strong>{props.index + 1}/{props.total}</strong></span>

              </CCardHeader>
              <CCardBody>
                <p style={{ fontSize: 'large' }}><em>{props.title}</em></p>
                {props.options.map((option, index) => {
                  return (
                    <div key={index}>
                      <CButton className='question-card' style={{ cursor: 'initial' }}>
                        <CFormCheck className='question-checkbox' id={(index + 1).toString()} value={option} key={option} label={option} onChange={props.handleSelect} />
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
                  disabled={props.previousQuestionFlag}
                  onClick={props.previousQuestion}
                >Back <CIcon icon={cilArrowCircleLeft} /></CButton>
                <CButton
                  style={{ width: '48%' }}
                  color='success'
                  variant='outline'
                  className='float-end'
                  onClick={props.submitAnswer}
                >Next <CIcon icon={cilArrowCircleRight} /></CButton>
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

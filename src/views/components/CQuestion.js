import React from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCardTitle,
  CCol,
} from '@coreui/react-pro'

export const CQuestion = (props) => {
  return (
    <>
      <CCol md={12}>
        <CCard md={12}>
          <CCardHeader>Question {props.index}<span className='float-end'><strong>{props.index}/{props.total}</strong></span></CCardHeader>
          <CCardBody>
            <CCardTitle>{props.title}</CCardTitle>
            {props.options.map((option, index) => {
              return (<CButton key={index}
                className='answer-button'
                onClick={() => { props.submitAnswer(option) }}
              >{option}</CButton>)
            })}
          </CCardBody>
        </CCard >
      </CCol>
    </>
  )
}
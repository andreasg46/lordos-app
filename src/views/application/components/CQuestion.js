import React from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCardTitle,
} from '@coreui/react-pro'

export const CQuestion = (props) => {
  return (
    <>
      <CCard>
        <CCardHeader>Question {props.index}<span className='float-end'><strong>{props.index}/{props.total}</strong></span></CCardHeader>
        <CCardBody>
          <CCardTitle>{props.title}</CCardTitle>
          <CButton className='answer-button'>Jeff Bezos</CButton>
          <CButton className='answer-button'>Elon Musk</CButton>
          <CButton className='answer-button'>Bill Gates</CButton>
          <CButton className='answer-button'>Tony Stark</CButton>
        </CCardBody>
        <CCardFooter>
          <CButton className='submit-button' href="#">Next</CButton>
        </CCardFooter>
      </CCard >
    </>
  )
}
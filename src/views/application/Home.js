import React from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCardText,
  CCardTitle,
} from '@coreui/react-pro'

const Home = () => {
  return (
    <CCard>
      <CCardHeader>Question 1 <span className='float-end'><strong>1/10</strong></span></CCardHeader>
      <CCardBody>
        <CCardTitle>Who is CEO of Tesla?</CCardTitle>
        <CButton className='answer-button'>Jeff Bezos</CButton>
        <CButton className='answer-button'>Elon Musk</CButton>
        <CButton className='answer-button'>Bill Gates</CButton>
        <CButton className='answer-button'>Tony Stark</CButton>
      </CCardBody>
      <CCardFooter>
        <CButton className='submit-button' href="#">Next</CButton>
      </CCardFooter>
    </CCard >
  )
}

export default Home

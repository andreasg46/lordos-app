import React, { useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCardTitle,
  CCol,
  CRow,
} from '@coreui/react-pro'
import CIcon from '@coreui/icons-react'
import { cilCheckCircle } from '@coreui/icons'

export const CQuestion = (props) => {
  const [options, setOptions] = useState([]);

  const handleSelect = (value) => {

    setOptions([...options, value]);


    console.log(options);
  }

  return (
    <>
      <CCol md={12}>
        <CCard md={12}>
          <CCardHeader>Question {props.index}<span className='float-end'><strong>{props.index}/{props.total}</strong></span></CCardHeader>
          <CCardBody>
            <CCardTitle>{props.title}</CCardTitle>
            {props.options.map((option, index) => {
              return (
                <CRow key={index}>
                  <CButton key={index}
                    className='question-card'
                    onClick={() => handleSelect(option)}
                  >{option}</CButton>
                </CRow>

              )
            })}
          </CCardBody>
          <CCardFooter>
            <CButton
              size="sm"
              color='success'
              className='float-end'
              onClick={() => { props.submitAnswer(options) }}
            >Submit <CIcon icon={cilCheckCircle} /></CButton>
          </CCardFooter>
        </CCard >
      </CCol>
    </>
  )
}
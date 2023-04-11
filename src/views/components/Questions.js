import React from 'react'
import { AppLoader } from 'src/components/app/AppLoader'
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
  var title_texts_pre = props.title.split('|')

  var color =
    title_texts_pre.length > 2  && /^\s*#[0-9A-F]{6}\s*$/i.test(title_texts_pre[2]) 
      ? title_texts_pre[2]
      : 'black'
  

  var title_texts = title_texts_pre.slice(0, 2).map(function (word, index) {
    if (index === 0) {
      return (
        <p style={{ fontSize: 'small', fontWeight: 'bold', color: color }} key={index}>
          {word}
        </p>
      )
    }
    if (index === 1) {
      return (
        <p style={{ fontSize: 'large', fontStyle: 'italic' }} key={index}>
          {word}
        </p>
      )
    }
  })

  return (
    <>
      <div className="questions-center">
        <div
          style={props.loader ? { display: 'none' } : { display: 'block' }}
          className="questions-card"
        >
          <CCol md={12}>
            <CCard md={12}>
              <CCardHeader>
                <strong>
                  Question {parseInt(props.index) + 1} ({props.typeOfQuestion} choice)
                </strong>
                <span className="float-end">
                  <strong>
                    {parseInt(props.index) + 1}/{props.total}
                  </strong>
                </span>
              </CCardHeader>
              <CCardBody>
                <div style={{ fontSize: 'large' }}>{title_texts}</div>
                {props.options.map((option, index) => {
                  if (props.typeOfQuestion == 'multiple') {
                    return (
                      <div key={index}>
                        <CButton className="question-card" style={{ cursor: 'initial' }}>
                          <CFormCheck
                            className="question-checkbox"
                            id={index.toString()}
                            value={option}
                            key={option}
                            label={option}
                            onChange={props.handleSelect}
                          />
                        </CButton>
                      </div>
                    )
                  } else {
                    return (
                      <div key={index}>
                        <CButton className="question-card" style={{ cursor: 'initial' }}>
                          <CFormCheck
                            className="question-checkbox"
                            id={index.toString()}
                            value={option}
                            key={option}
                            label={option}
                            onChange={props.handleSelect}
                            name="flexRadioDefault"
                            type="radio"
                          />
                        </CButton>
                      </div>
                    )
                  }
                })}
              </CCardBody>
              <CCardFooter>
                <CButton
                  style={{ width: '48%' }}
                  color="primary"
                  variant="outline"
                  disabled={props.previousQuestionFlag}
                  onClick={props.previousQuestion}
                >
                  Back <CIcon icon={cilArrowCircleLeft} />
                </CButton>
                <CButton
                  style={{ width: '48%' }}
                  color="success"
                  variant="outline"
                  className="float-end"
                  onClick={props.submitAnswer}
                >
                  Next <CIcon icon={cilArrowCircleRight} />
                </CButton>
              </CCardFooter>
            </CCard>
          </CCol>
        </div>
        <div style={props.loader ? { display: 'block' } : { display: 'none' }}>
          <AppLoader />
        </div>
      </div>
    </>
  )
}

export default Questions

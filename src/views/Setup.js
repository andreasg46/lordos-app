import React, { useEffect, useState } from 'react'
import { CContainer } from '@coreui/react-pro';
import { useNavigate } from 'react-router-dom';
import { cilArrowCircleRight, cilBell, cilSearch } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { CCard, CCardBody, CCardGroup, CCol, CForm, CFormInput, CImage, CInputGroup, CInputGroupText, CLoadingButton, CRow } from '@coreui/react-pro'
import { getMobileOperatingSystem, today } from 'src/helpers';

const Setup = () => {
  const navigate = useNavigate();

  const [loader, setLoader] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [buttonText, setButtonText] = useState('Subscribe');
  const [buttonStatus, setButtonStatus] = useState(false);

  const [os, setOS] = useState(getMobileOperatingSystem());

  useEffect(() => {
    // alert(os);
  }, []);



  const handleSubmit = (e) => {
    setLoader(true);
  }

  return (
    <>
      <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
        <CContainer>
          <CRow className="justify-content-center">
            <CCol md={8} lg={8}>
              <CCardGroup>

                <CRow style={{ verticalAlign: 'baseline' }} >
                  <CCard className='landing-card-lg' style={{ writingMode: 'vertical-rl', background: '#014d4d' }}>
                    <CCardBody className="text-center" >
                      <CImage src='logo.png' style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                    </CCardBody>
                  </CCard>
                </CRow>

                <CCard className="p-6 bg-white text-black">
                  <CCardBody>
                    <CImage rounded={true} src='logo-2.png' className='landing-card' style={{ width: '30%', objectFit: 'cover' }} />
                    <br className='landing-card' ></br>
                    <CForm onSubmit={handleSubmit}>
                      <h4>Welcome to Lordos App</h4>
                      <p style={{ color: '#c4c9d0' }}>Lets set up some things first...</p>

                      <CInputGroup className="mb-3">
                        <CInputGroupText>
                          Phone Number
                        </CInputGroupText>
                        <CFormInput placeholder="Enter your phone number"
                          onChange={(e) => { setPhoneNumber(e.target.value.toUpperCase()) }}
                        />
                      </CInputGroup>

                      <div className='onesignal-customlink-container'></div>

                      <CRow>
                        <CCol style={{ textAlign: 'end', margin: '20px 0 0 0' }}>
                          <CLoadingButton
                            color='success'
                            spinnerType='grow'
                            loading={loader}
                            variant='outline'
                            disabled={buttonStatus}
                            type='submit'
                          ><CIcon icon={cilBell} /> {buttonText}
                          </CLoadingButton>
                        </CCol>
                      </CRow>
                    </CForm>
                  </CCardBody>
                </CCard>
              </CCardGroup>
            </CCol>
          </CRow>
        </CContainer>
      </div>
    </>
  )
}

export default Setup

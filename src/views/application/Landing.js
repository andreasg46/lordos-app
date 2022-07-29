import React, { useState } from 'react'
import { CContainer } from '@coreui/react-pro';

import { useNavigate } from 'react-router-dom';
import { cilSearch } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { CCard, CCardBody, CCardGroup, CCol, CForm, CFormInput, CImage, CInputGroup, CInputGroupText, CLoadingButton, CRow } from '@coreui/react-pro'
import { GetApi } from './functions/axios';
import { api_server_url } from 'src/config/urls';
import { Alert } from './components/Alerts';
import { setCookie } from './components/Cookies';

const Landing = () => {
  const navigate = useNavigate();

  const [loader, setLoader] = useState(false);
  const [code, setCode] = useState('');
  const [buttonText, setButtonText] = useState('Join');
  const [buttonStatus, setButtonStatus] = useState(false);

  function openListener() {
    const interval = setInterval(() => {
      GetApi(api_server_url + '/session/user/' + code.toUpperCase())
        .then(function (value) {
          if (value) {
            if (value.parent_1 && value.parent_2 && value.child) { // Check if session has all members joined
              setLoader(false);
              Alert('Others joined!', 'success');
              setLoader(false);
              navigate('/');
              clearInterval(interval);
            }
          }
        })
    }, 5000);
  }

  const handleInput = (e) => {
    setCookie('code', e.target.value.toUpperCase(), 180);
    setCode(e.target.value.toUpperCase());
  }
  const handleSubmit = () => {
    setLoader(true);

    GetApi(api_server_url + '/session/user/' + code.toUpperCase())
      .then(function (value) {
        if (value) {
          Alert('Session found!', 'success')
          setCookie('session_id', value.id, 180);
          setCookie('status', value.status, 180);
          if (value.parent_1 && value.parent_2 && value.child) { // Check if session has all members joined
            setLoader(false);
            navigate('/');
          } else {
            setButtonText('Waiting for others to join...'); // Wait for others to join
            setButtonStatus(true);

            openListener();
          }
        } else {
          Alert('User not found!', 'error') // Invalid member
          setLoader(false);
        }
      });
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
                      <p style={{ color: '#c4c9d0' }}>Get your session</p>
                      <CInputGroup className="mb-3">
                        <CInputGroupText>
                          Code
                        </CInputGroupText>
                        <CFormInput placeholder="Enter your code" onChange={handleInput}
                        />
                      </CInputGroup>
                      {/* <CFormCheck
                        type="radio"
                        name="flexRadioDefault"
                        id="flexRadioDefault1"
                        label="Parent"
                      />
                      <CFormCheck
                        type="radio"
                        name="flexRadioDefault"
                        id="flexRadioDefault2"
                        label="Child"
                        defaultChecked
                      /> */}
                      <CRow>
                        <CCol style={{ textAlign: 'end', margin: '20px 0 0 0' }}>
                          <CLoadingButton
                            color='success'
                            spinnerType='grow'
                            loading={loader}
                            variant='outline'
                            disabled={buttonStatus}
                            type='submit'
                          // onClick={() => { handleSubmit() }
                          // }
                          ><CIcon icon={cilSearch} /> {buttonText}
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

export default Landing

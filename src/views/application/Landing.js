import React, { useState } from 'react'
import { CContainer } from '@coreui/react-pro';
import { useNavigate } from 'react-router-dom';
import { cilSearch } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { CCard, CCardBody, CCardGroup, CCol, CForm, CFormInput, CImage, CInputGroup, CInputGroupText, CLoadingButton, CRow } from '@coreui/react-pro'
import { GetApi, PutApi } from './functions/axios';
import { api_server_url } from 'src/config/urls';
import { Alert, Alert2 } from './components/Alerts';
import { getCookie, setCookie } from './functions/cookies';
import OneSignal from 'react-onesignal';
import { AddTags } from '../application/Administrator/OneSignalServer';

setCookie('session_id', '', 7);
setCookie('code', '', 7);
setCookie('status', '', 7);

const Landing = () => {
  const navigate = useNavigate();

  const [userId, setUserId] = useState(''); // One Signal

  const [loader, setLoader] = useState(false);
  const [code, setCode] = useState('');
  const [buttonText, setButtonText] = useState('Join');
  const [buttonStatus, setButtonStatus] = useState(false);


  var day = new Date();
  var start_date = day.toLocaleString();
  var end_date = day.getTime() + 7 * 24 * 60 * 60 * 1000; // End date time
  end_date = new Date(end_date);

  OneSignal.getUserId(function (userId) {
    setUserId(userId);
  });

  const findSession = (e) => { // Retrieve user session
    e.preventDefault();

    setLoader(true);

    GetApi(api_server_url + '/session/user/' + code)
      .then(function (value) {
        if (value) {
          Alert('Session found!', 'success')
          setCookie('session_id', value.id, 180);
          PutApi(api_server_url + '/session/update/' + value.id + '/' + code, { activated: true });

          AddTags(userId, value.id, code);

          GetApi(api_server_url + '/session/' + value.id) // Get all sessions and do the checks
            .then(function (value) {
              if (value) {
                setButtonText('Waiting for others to join...'); // Wait for others to join
                setButtonStatus(true);
                openListener();
              }
            })
        } else {
          Alert2('Session not found!', 'error');
          setLoader(false);
        }
      });
  }

  function openListener() { // Check if all users are activated and update db
    const interval = setInterval(() => {
      GetApi(api_server_url + '/session/count/' + getCookie('session_id'))
        .then(function (value) {
          if (value) {
            if (value.count === 0) { // Check if session has all members joined
              PutApi(api_server_url + '/sessions/update/' + getCookie('session_id'), { start_date: start_date, end_date: end_date, status: 'Active' });
              setCookie('status', 'Active', 180);
              setLoader(false);
              Alert2('Session established!', 'success');
              setLoader(false);
              navigate('/');
              clearInterval(interval);
            }
          }
        })
    }, 4000);
  }

  const handleInput = (e) => {
    setCookie('code', e.target.value.toUpperCase(), 180);
    setCode(e.target.value.toUpperCase());
  }

  const handleSubmit = (e) => {
    setLoader(true);
    findSession(e);
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
                        <CFormInput placeholder="Enter your code"
                          onChange={handleInput}
                        />
                      </CInputGroup>
                      <CRow>
                        <CCol style={{ textAlign: 'end', margin: '20px 0 0 0' }}>
                          <CLoadingButton
                            color='success'
                            spinnerType='grow'
                            loading={loader}
                            variant='outline'
                            disabled={buttonStatus}
                            type='submit'
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

import React, { useEffect, useState } from 'react'
import { CCard, CCardBody, CCardGroup, CCol, CForm, CImage, CLoadingButton, CRow, CContainer, CBadge } from '@coreui/react-pro'
import { cilSearch } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { GetApi, PutApi } from '../services/Axios';
import { api_server_url } from 'src/config/urls';
import { Alert, Alert2 } from '../services/Alerts';
import { getCookie, resetCookies, setCookie } from '../services/Cookies';
import { AddDevice, AddTags, StartCampaign } from '../services/OneSignalServer';
import Swal from 'sweetalert2';
import { findOtherUsers, findRole, findSession, findUser } from 'src/services/APIs';
import { useNavigate } from 'react-router-dom';
import OneSignal from 'react-onesignal';
import { isIOS } from 'src/helpers';
import { AppLoader } from 'src/components/app/AppLoader';

const getBadge = (status) => {
  switch (status) {
    case 'Joined':
      return 'success-gradient'
    case 'Inactive':
      return 'secondary-gradient'
    case 'Pending':
      return 'warning-gradient'
    case 'Banned':
      return 'danger-gradient'
    default:
      return 'secondary-gradient'
  }
}

const Landing = () => {
  const navigate = useNavigate();

  const [userReady, setUserReady] = useState(false);

  const [loader, setLoader] = useState(false);
  const [buttonText, setButtonText] = useState('Join');
  const [buttonStatus, setButtonStatus] = useState(false);

  let code = ''
  let phone = '';
  let session_id = '';
  const [code_S, setCode_S] = useState('');
  const [phone_S, setPhone_S] = useState('');
  const [session_id_S, setSessionId_S] = useState('');
  const [other_users, setOtherUsers] = useState([]);

  useEffect(() => {
    resetCookies();
    if (!getCookie('session_id')) { WelcomeAlert(); }
  }, []);

  const WelcomeAlert = async () => {

    Swal.fire({
      title: 'Welcome',
      text: 'to Lordos App',
      imageUrl: 'logo-2.png',
      imageWidth: 80,
      imageAlt: 'Lordos App',
      showConfirmButton: true,
      confirmButtonText: "Proceed",
      confirmButtonColor: '#198754',
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        EnterCode();
      }
    })

    const EnterCode = async () => {
      const swalQueue = Swal.mixin({
        confirmButtonText: 'Next',
        confirmButtonColor: '#198754',
        allowOutsideClick: false,
      })

      await swalQueue.fire({
        title: "What's your code?",
        input: "text",
        inputPlaceholder: 'Enter your code...',
        currentProgressStep: 0,
        inputValidator: (value) => {
          if (!value) {
            return 'You need to write something!'
          } else {
            code = value;
            setCode_S(value);

            findUser(code) // Step 1  => Get User Info
              .then(value => {
                console.log(value);
                setCookie('code', code, 180);

                findRole(value.RoleId) // Step 2  => Get Role Info
                  .then(value => {
                    console.log(value);
                    setCookie('role', value.title, 180);

                    findSession(code) // Step 3  => Get Session Info
                      .then(value => {
                        console.log(value);

                        session_id = value.id || '';
                        setSessionId_S(value.id || '');

                        setCookie('is_admin', (session_id === 9000) ? true : false, 180);

                        //===== CASE 1 =====// Session not found
                        if (session_id === '') {
                          swalQueue.fire({
                            title: "Session not found please try again!",
                            currentProgressStep: 1,
                          }).then((result) => {
                            if (result.isConfirmed) {
                              WelcomeAlert();
                            }
                          })
                        }

                        //===== CASE 2 =====// Session Found 
                        else if (session_id) { // (iPhone User)

                          if (isIOS) {
                            swalQueue.fire({
                              title: "What's your phone number?",
                              input: "text",
                              inputPlaceholder: '99123456',
                              currentProgressStep: 1,
                              inputValidator: (value) => {

                                if (!value) {
                                  return 'You need to write something!'
                                }
                                else {
                                  phone = '+357' + value;
                                  setPhone_S('+357' + value);
                                  AddDevice('+357' + value, code, session_id).then(value => {
                                    if (value.response !== '') {
                                      Alert(value.response.message, 'success')
                                      setUserReady(true);
                                      console.log(value);
                                    } else {
                                      swalQueue.fire({
                                        title: "Oops. Something went wrong. Please try again!",
                                        currentProgressStep: 1,
                                      }).then((result) => {
                                        if (result.isConfirmed) {
                                          WelcomeAlert();
                                        }
                                      })
                                    }
                                  }
                                  );
                                }
                              }
                            })
                          }

                          else { // (Not iPhone User)
                            swalQueue.fire({
                              title: "Please subscribe to the push notification service before joining the session...",
                              currentProgressStep: 1,
                            }).then((result) => {
                              if (result.isConfirmed) {
                                OneSignal.showNativePrompt().then(() => {
                                  Promise.resolve(OneSignal.isPushNotificationsEnabled()).then((value) => {
                                    console.log('Push Notifications enabled: ' + value)
                                    if (value) {
                                      setUserReady(true);
                                    } else {
                                      Alert('Push Notifications must be enabled!', 'info')
                                    }
                                  })
                                    .catch(error => {
                                      Alert('Push Notifications must be enabled!', 'info')
                                    });
                                });

                              }
                            })
                          }

                        }

                      });
                  });
              })
          }
        }
      })
    }
  }

  const joinSession = async (e) => { // Retrieve user session
    e.preventDefault();

    setCookie('session_id', session_id_S, 180);
    setLoader(true);

    PutApi(api_server_url + '/session/update/' + session_id_S + '/' + code_S, { activated: true }) // Update session status
      .then(() => {
        setButtonText('Waiting for others to join...'); // Wait for others to join
        setButtonStatus(true);

        if (!isIOS) {
          OneSignal.getUserId(function (userId) {
            AddTags(userId, session_id_S, code_S).then(() => {
              openListener(); // Wait for others to join
            });
          });
        }

        if (isIOS) {
          openListener(); // Wait for others to join
        }
      }).catch(error => {
        alert(error);
      });
  }

  function openListener() { // Check if all users are activated and update db
    let day = new Date();
    let end_date = day.getTime() + 7 * 24 * 60 * 60 * 1000; // End date time
    end_date = new Date(end_date);

    const interval = setInterval(() => {
      findOtherUsers(session_id_S, code_S).then((value) => {
        setOtherUsers(value);

        GetApi(api_server_url + '/session/count/' + getCookie('session_id'))
          .then(function (value) {
            if (value) {
              if (value.count === 0) { // Check if session has all members joined
                PutApi(api_server_url + '/sessions/update/' + getCookie('session_id'), { start_date: new Date(day), end_date: end_date, status: 'Active' });
                setCookie('status', 'Active', 180);
                setLoader(false);

                Alert2('Session established!', 'success');

                StartCampaign(code_S, phone_S); // Start Notifications campaign

                setLoader(false);
                navigate('/');
                clearInterval(interval);

              }
            }
          })

      })

    }, 5000);
  }

  const handleSubmit = (e) => {
    setLoader(true);
    joinSession(e);
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
                      <CImage src='logo.png' style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
                    </CCardBody>
                  </CCard>
                </CRow>

                <CCard className="p-6 bg-white text-black">
                  <CCardBody>
                    <CImage rounded={true} src='logo-2.png' className='landing-card' style={{ width: '30%', objectFit: 'cover' }} />
                    <br className='landing-card' ></br>
                    <CForm onSubmit={handleSubmit}>
                      <h4>Welcome to Lordos App</h4>
                      <br />
                      {other_users.map((user, index) => {
                        return (
                          <div key={index}>
                            {user.code}: <CBadge
                              color={getBadge(user.activated ? 'Joined' : 'Pending')}
                            >{user.activated ? 'Joined' : 'Pending'}</CBadge>
                          </div>
                        )
                      })}

                      <br />
                      <CRow>
                        <CCol style={{ display: userReady ? 'none' : 'block' }} >
                          <AppLoader />
                        </CCol>
                        <CCol style={{ textAlign: 'end', margin: '20px 0 0 0', display: userReady ? 'block' : 'none' }}>
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

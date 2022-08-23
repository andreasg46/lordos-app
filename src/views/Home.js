import React, { useEffect, useState } from 'react'
import { findOtherUsers, findOtherUsersAnswered } from 'src/services/APIs';
import { getCookie } from 'src/services/Cookies';
import { GetCurrentDeadline, GetCurrentPhase, GetSettings, phase_A_time, phase_B_time, phase_C_time } from 'src/config/globals';
import { CheckSession } from 'src/services/Auth';
import Questions from './components/Questions';
import { AppLoader } from 'src/components/app/AppLoader';
import { HomeCard } from './components/HomeCard';
import { GetApi, PostApi } from 'src/services/Axios';
import { api_server_url } from 'src/config/urls';
import { Alert } from 'src/services/Alerts';
import { CBadge, CButton, CCol } from '@coreui/react-pro';
import { getRandomInt } from 'src/helpers';
import CIcon from '@coreui/icons-react';
import { cilPencil } from '@coreui/icons';


const Home = () => {
  CheckSession();

  var backPresses = 0;
  var isAndroid = navigator.userAgent.toLowerCase().indexOf("android") > -1;
  var maxBackPresses = 2;
  function handleBackButton(init) {
    if (init !== true)
      backPresses++;
    if ((!isAndroid && backPresses >= maxBackPresses) ||
      (isAndroid && backPresses >= maxBackPresses - 1)) {
      window.history.back();
    } else
      window.history.pushState({}, '');
  }
  function setupWindowHistoryTricks() {
    handleBackButton(true);
    window.addEventListener('popstate', handleBackButton);
  }

  useEffect(() => {
    setupWindowHistoryTricks();
    GetSettings();
    GetPhase();

    if (currentPhase !== 'N/A') {
      GetQuestions();
    }


    let tmpOtherUsers = [];
    Promise.resolve(findOtherUsers(getCookie('session_id'), getCookie('code')))
      .then(value1 => {
        tmpOtherUsers = value1 || [];
        for (let i = 0; i < tmpOtherUsers.length; i++) {
          tmpOtherUsers[i]['answered'] = false;
        }
        Promise.resolve(findOtherUsersAnswered(getCookie('session_id'), getCookie('code'), previousPhase, today, tomorrow))
          .then(value2 => {
            value1.map((user, index) => {
              value2.map((answer) => {
                if (user.code === answer.code) {
                  tmpOtherUsers[index]['answered'] = true;
                }
              })
            })
            setOtherUsers(tmpOtherUsers);
            setLoader(false);
          });
      });
  }, []);

  const [loader, setLoader] = useState(true);
  const [otherUsers, setOtherUsers] = useState([]);
  const [pendingPhaseText, setPendingPhaseText] = useState('N/A');
  const [currentPhaseText, setCurrentPhaseText] = useState('N/A');
  const [currentDeadlineText, setCurrentDeadlineText] = useState('N/A');

  const [questionsAvailable, setQuestionsAvailable] = useState(false);

  let previousPhase = 'N/A';
  let currentPhase = 'N/A';

  const role = getCookie('role') === 'Child' ? 'child' : 'parent';

  const [question_id, setQuestionId] = useState(0);
  const [title, setTitle] = useState('');
  const [options, setOptions] = useState([]);

  const [index, setIndex] = useState(0);
  const [total, setTotal] = useState(0);

  let type = role;


  let today = new Date().toISOString().slice(0, 10);
  const tmp = new Date(today);
  tmp.setDate(tmp.getDate() + 1);
  let tomorrow = new Date(tmp).toISOString().slice(0, 10);

  const GetPhase = () => {
    let hours = new Date().getUTCHours() + 3;

    currentPhase = GetCurrentPhase();
    setCurrentPhaseText(currentPhase);
    setCurrentDeadlineText(GetCurrentDeadline());

    setQuestionsAvailable(currentPhase !== 'N/A' ? true : false);

    // Home card
    if (hours >= phase_A_time.slice(0, 2) && hours < phase_B_time.slice(0, 2)) {
      previousPhase = 'A';
      setPendingPhaseText('B starts at ' + phase_B_time);
    } else if (hours >= phase_B_time.slice(0, 2) && hours < phase_C_time.slice(0, 2)) {
      previousPhase = 'B';
      setPendingPhaseText('C starts at ' + phase_C_time);
    } else {
      previousPhase = 'C'; // from 18:00 till 09:00 
      setPendingPhaseText('A starts at ' + phase_A_time);
    }
  }

  const GetQuestions = () => {
    setIndex(0);

    Promise.resolve(
      GetApi(api_server_url + '/questions/' + type + '/' + currentPhase)
        .then(function (value) {

          console.log(value);
          if (value.questions) {

            if (value.questions.length !== 0) {
              setQuestionId(value.questions[index].id);
              setTitle(value.questions[index].title);
              setOptions(value.questions[index].options);
              setIndex(index + 1);
              setTotal(value.count);
            } else {
              setTitle('No available questions');
              setIndex('');
              setTotal('');
            }
          } else {
            setTitle('No available questions');
            setIndex('');
            setTotal('');
          }
          setLoader(false);
        })
    )
  }

  let selected_options = [];

  const handleSelect = (e) => {
    if (e.target.checked) {
      selected_options.push(e.target.value);
    } else {
      const result = selected_options.filter(element => element !== e.target.value);
      selected_options = result;
    }
  }

  function nextQuestion() {
    if (index < total) {
      Promise.resolve(
        GetApi(api_server_url + '/questions/' + type + '/' + currentPhaseText)
          .then(function (value) {
            if (value) {
              setTitle(value.questions[index].title);
              setOptions(value.questions[index].options);
              setQuestionId(value.questions[index].id);
              setIndex(index + 1);
              setTotal(value.count);
            }
          })
      )
    } else {
      Alert('Completed!', 'success');
      setQuestionsAvailable(false);

      setTitle('');
      setOptions([]);
      setIndex(0);
      setTotal(0);
    }
  }

  function editAnswers() {
    window.location.assign('/');
  }

  function submitAnswer() {
    PostApi(api_server_url + '/answer/create', { id: getRandomInt(), selected: selected_options, UserCode: getCookie('code'), QuestionId: question_id });

    if (index < total) {
      Promise.resolve(
        GetApi(api_server_url + '/questions/' + type + '/' + currentPhaseText)
          .then(function (value) {
            if (value) {
              setTitle(value.questions[index].title);
              setOptions(value.questions[index].options);
              setQuestionId(value.questions[index].id);
              setIndex(index + 1);
              setTotal(value.count);
            }
          })
      )
    } else {
      Alert('Completed!', 'success');

      setQuestionsAvailable(false);
      setTitle('');
      setOptions([]);
      setIndex(0);
      setTotal(0);
    }
  }

  return (
    <>
      <div style={{ width: '100%', display: (currentPhaseText === 'N/A') ? 'none' : 'block' }}>
        <CButton variant={'ghost'} className={'float-end'} onClick={editAnswers}>Edit answers<CIcon icon={cilPencil} /></CButton>
      </div>

      <div style={{ display: loader ? 'none' : 'block' }}>

        <div style={{ width: '100%', display: (currentPhaseText === 'N/A') ? 'none' : 'block' }}>
          <CBadge color='success-gradient'>Phase {currentPhaseText} is running</CBadge> <CBadge color='danger-gradient'>Deadline at {currentDeadlineText}</CBadge>
          <hr />
        </div>



        <div style={{ display: (questionsAvailable) ? 'block' : 'none' }}>
          <Questions options={options} loader={loader} index={index} id={question_id} title={title} total={total} handleSelect={handleSelect} nextQuestion={nextQuestion} submitAnswer={submitAnswer} />
        </div>

        <div className='home-card' style={{ display: (!questionsAvailable) ? 'block' : 'none' }}>
          <HomeCard otherUsers={otherUsers} pendingPhaseText={pendingPhaseText} />
        </div >

      </div>

      {/* <div style={{ display: (loader ? 'block' : 'none') }}>
        <AppLoader />
      </div> */}
    </>
  )
}

export default Home

import React, { useEffect, useState } from 'react'
import { findOtherUsers, findOtherUsersAnswered, findUserAnswered } from 'src/services/APIs';
import { getCookie } from 'src/services/Cookies';
import { GetCurrentDeadline, GetCurrentPhase, GetPendingPhase, GetPendingPhaseTime, GetPreviousPhase } from 'src/config/globals';
import { CheckSession } from 'src/services/Auth';
import Questions from './components/Questions';
import { HomeCard } from './components/HomeCard';
import { GetApi, PostApi } from 'src/services/Axios';
import { api_server_url } from 'src/config/urls';
import { Alert } from 'src/services/Alerts';
import { CBadge, CButton } from '@coreui/react-pro';
import { getRandomInt, setupWindowHistoryTricks } from 'src/helpers';
import CIcon from '@coreui/icons-react';
import { cilPencil } from '@coreui/icons';

const Home = () => {
  CheckSession();

  const [loader, setLoader] = useState(true);

  const [currentPhaseText, setCurrentPhaseText] = useState('N/A');
  const [currentDeadlineText, setCurrentDeadlineText] = useState('N/A');
  const [pendingPhaseText, setPendingPhaseText] = useState('N/A');

  const [questionsAvailable, setQuestionsAvailable] = useState(false);
  const [previousQuestionFlag, setPreviousQuestionFlag] = useState(true);
  const [editAnswersFlag, setEditAnswersFlag] = useState(false);

  let previousPhase = 'N/A';
  let currentPhase = 'N/A';
  let pendingPhase = 'N/A';

  const [otherUsers, setOtherUsers] = useState([]);
  const role = getCookie('role') === 'Child' ? 'child' : 'parent';

  let tmp_questions = [];
  const [questions, setQuestions] = useState([]);

  const [question_id, setQuestionId] = useState(0);

  const [title, setTitle] = useState('');
  const [options, setOptions] = useState([]);

  const [indexText, setIndexText] = useState(0);
  let index = 0;

  const [total, setTotal] = useState(0);

  let type = role;

  let today = new Date().toISOString().slice(0, 10);
  const tmp = new Date(today);
  tmp.setDate(tmp.getDate() + 1);
  let tomorrow = new Date(tmp).toISOString().slice(0, 10);

  useEffect(() => {
    setupWindowHistoryTricks();

    GetPhase();
    GetOtherUsersResponses();
  }, []);

  const GetPhase = () => {
    console.log("Getting Phase.. ");

    previousPhase = GetPreviousPhase();
    currentPhase = GetCurrentPhase();
    pendingPhase = GetPendingPhase();
    let pendingPhaseTime = GetPendingPhaseTime();

    setPendingPhaseText(pendingPhase + ' starts at ' + pendingPhaseTime);

    if (currentPhase !== 'N/A') {
      Promise.resolve(findUserAnswered(getCookie('session_id'), getCookie('code'), currentPhase, today, tomorrow))
        .then(value => {

          if (value.length > 0 && !editAnswersFlag) { // User Completed the current Phase
            setEditAnswersFlag(true);
            setQuestionsAvailable(false);
          } else {
            setEditAnswersFlag(false);
            GetQuestions();
          }

        })
    }

    setCurrentPhaseText(currentPhase);
    setCurrentDeadlineText(GetCurrentDeadline());

    setQuestionsAvailable(currentPhase !== 'N/A' ? true : false);

  }

  const GetOtherUsersResponses = () => {
    // Check if other users completed the task
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
          }).catch((e) => {
            setLoader(false);
          });
      }).catch((e) => {
        setLoader(false);
      });
  }

  const GetQuestions = () => {
    index = 0;
    setIndexText(0);

    Promise.resolve(
      GetApi(api_server_url + '/questions/' + type + '/' + currentPhase)
        .then(function (value) {

          if (value.questions) {
            if (value.questions.length !== 0) {
              tmp_questions = value.questions;
              setQuestions(tmp_questions);

              // Set current Question
              setQuestionId(tmp_questions[indexText].id);
              setTitle(tmp_questions[indexText].title);
              setOptions(tmp_questions[indexText].options);
              setTotal(value.count);

            } else {
              setTitle('No available questions');
              setIndexText('');
              setTotal('');
            }
          } else {
            setTitle('No available questions');
            setIndexText('');
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

  function editAnswers() {
    setQuestionsAvailable(true);

    GetPhase();
    if (currentPhase !== 'N/A') {
      GetQuestions();
    }
  }

  function previousQuestion() {
    index = indexText;
    index--;

    if (index >= 0) {
      setIndexText(index);
      setTitle(questions[index].title);
      setOptions(questions[index].options);
      setQuestionId(questions[index].id);
    }
    if (index === 0) {
      setPreviousQuestionFlag(true);
    }
  }

  function submitAnswer() {
    setPreviousQuestionFlag(false);

    PostApi(api_server_url + '/answer/create', { id: getRandomInt(), selected: selected_options, UserCode: getCookie('code'), QuestionId: question_id });

    index = indexText;
    index++;

    if (index < total) {
      setIndexText(index);
      setTitle(questions[index].title);
      setOptions(questions[index].options);
      setQuestionId(questions[index].id);
    }
    else {
      Alert('Completed!', 'success');
      setQuestionsAvailable(false);
      setPreviousQuestionFlag(true);
      setEditAnswersFlag(true);

      setTitle('');
      setOptions([]);
      setIndexText(0);
      setTotal(0);
    }
  }

  return (
    <>
      <div style={{ width: '100%', display: (editAnswersFlag) ? 'block' : 'none' }}>
        <CButton variant={'ghost'} className={'float-end'} onClick={editAnswers}>Edit answers <CIcon icon={cilPencil} /></CButton>
      </div>

      <div style={{ display: loader ? 'none' : 'block' }}>

        <div style={{ width: '100%', display: (currentPhaseText === 'N/A') ? 'none' : 'block' }}>
          <CBadge color='success-gradient'>Phase {currentPhaseText} is running</CBadge> <CBadge color='danger-gradient'>Deadline at {currentDeadlineText}</CBadge>
          <hr />
        </div>



        <div style={{ display: (questionsAvailable) ? 'block' : 'none' }}>
          <Questions options={options} loader={loader} index={indexText} id={question_id} title={title} total={total} handleSelect={handleSelect} previousQuestion={previousQuestion} previousQuestionFlag={previousQuestionFlag} submitAnswer={submitAnswer} />
        </div>

        <div className='home-card' style={{ display: (!questionsAvailable) ? 'block' : 'none' }}>
          <HomeCard otherUsers={otherUsers} pendingPhaseText={pendingPhaseText} />
        </div >

      </div>
    </>
  )
}

export default Home
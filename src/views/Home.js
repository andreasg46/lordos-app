import React, { useEffect, useState } from 'react'
import { findOtherUsers, findOtherUsersAnswered, findUserAnswered } from 'src/services/APIs';
import { getCookie, setCookie, setCookieByHours, setCookieByMinutes } from 'src/services/Cookies';
import { GetCurrentDeadline, GetCurrentPhase, GetPendingPhase, GetPendingPhaseTime, GetPreviousPhase, GetSettings, settings } from 'src/config/globals';
import { CheckSession } from 'src/services/Auth';
import Questions from './components/Questions';
import { HomeCard } from './components/HomeCard';
import { GetApi, PostApi } from 'src/services/Axios';
import { api_server_url } from 'src/config/urls';
import { Alert } from 'src/services/Alerts';
import { CBadge } from '@coreui/react-pro';
import { getRandomInt, setupWindowHistoryTricks } from 'src/helpers';
import { IdleTimer } from 'src/services/IdleTimer';


const Home = () => {
  var now = new Date();
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
  let pendingPhaseTime = 'N/A';

  const [otherUsers, setOtherUsers] = useState([]);
  const role = getCookie('role') === 'Child' ? 'child' : 'parent';

  let tmp_questions = [];
  const [questions, setQuestions] = useState([]);

  const [question_id, setQuestionId] = useState(0);

  const [title, setTitle] = useState('');
  const [typeOfQuestion, setTypeOfQuestion] = useState('');
  const [options, setOptions] = useState([]);
  const [correct_option, setCorrectOption] = useState(0);

  if (!getCookie('index')) { setCookieByHours('index', 0, 1); }
  const [indexText, setIndexText] = useState((getCookie('index')));
  let index = getCookie('index');

  const [total, setTotal] = useState(0);

  let type = role;

  let today = new Date().toISOString().slice(0, 10);
  const tmp = new Date(today);
  tmp.setDate(tmp.getDate() + 1);
  let tomorrow = new Date(tmp).toISOString().slice(0, 10);

  useEffect(() => {
    setupWindowHistoryTricks();

    GetSettings().then(() => {
      GetPhase();
      GetOtherUsersResponses();
    })
    IdleTimer();
  }, []);

  const GetPhase = () => {

    if ((getCookie('starting_date') > now.getTime())) {
      previousPhase = 'N/A';
      currentPhase = 'N/A';
      pendingPhase = 'A';
      pendingPhaseTime = '09:00';
    } else {
      previousPhase = GetPreviousPhase();
      currentPhase = GetCurrentPhase();
      pendingPhase = GetPendingPhase();
      pendingPhaseTime = GetPendingPhaseTime();
    }

    setPendingPhaseText(pendingPhase + ' starts at ' + pendingPhaseTime);

    if (currentPhase !== 'N/A') {
      Promise.resolve(findUserAnswered(getCookie('session_id'), getCookie('code'), currentPhase, today, tomorrow, role))
        .then(value => {
          if (value.count[0].count == value.q_count[0].count) { // User Completed the current Phase
            console.log("Current Phase Completed");
            setEditAnswersFlag(true);
            setQuestionsAvailable(false);
          } else {
            console.log(value);
            //setCookieByMinutes('index', value.count[0].count, 1);
            setIndexText(getCookie('index'));
            index = getCookie('index');
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
    // // Check if other users completed the task
    // let tmpOtherUsers = [];

    // Promise.resolve(findOtherUsers(getCookie('session_id'), getCookie('code')))
    //   .then(value1 => {
    //     tmpOtherUsers = value1 || [];
    //     for (let i = 0; i < tmpOtherUsers.length; i++) {
    //       tmpOtherUsers[i]['answered'] = false;
    //     }
    //     Promise.resolve(findOtherUsersAnswered(getCookie('session_id'), getCookie('code'), previousPhase, today, tomorrow))
    //       .then(value2 => {
    //         value1.map((user, index) => {
    //           value2.map((answer) => {
    //             if (user.code === answer.code) {
    //               tmpOtherUsers[index]['answered'] = true;
    //             }
    //           })
    //         })
    //         setOtherUsers(tmpOtherUsers);
    //         setLoader(false);
    //       }).catch((e) => {
    //         setLoader(false);
    //       });
    //   }).catch((e) => {
    //     setLoader(false);
    //   });

    setLoader(false);
  }

  const GetQuestions = () => {
    Promise.resolve(
      GetApi(api_server_url + '/questions/' + type + '/' + currentPhase)
        .then(function (value) {

          if (getCookie('completed') || (getCookie('starting_date') > now.getTime())) {
            setQuestionsAvailable(false);
          }

          if (value.questions && !getCookie('completed')) {
            if (value.questions.length !== 0) {
              tmp_questions = value.questions;
              setQuestions(tmp_questions);

              // Set current Question
              setQuestionId(tmp_questions[indexText].id);
              setTitle(tmp_questions[indexText].title);
              setTypeOfQuestion(tmp_questions[indexText].response);
              setOptions(tmp_questions[indexText].options);
              setCorrectOption(tmp_questions[indexText].correct_option);
              setTotal(value.count);
            } else {
              setTitle('No available questions');
              setTypeOfQuestion('');
              setIndexText('');
              setTotal('');
            }
          } else {
            setTitle('No available questions');
            setTypeOfQuestion('');
            setIndexText('');
            setTotal('');
          }
          setLoader(false);
        })
    )
  }

  let selected_options = [];

  const handleSelect = (e) => {
    if (e.target.checked && typeOfQuestion == 'multiple') {
      selected_options.push(e.target.id);
    } else if (e.target.checked && typeOfQuestion == 'single') {
      selected_options = [];
      selected_options.push(e.target.id);
    } else {
      const result = selected_options.filter(element => element !== e.target.id);
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
    index = getCookie('index');
    index--;
    setCookieByHours('index', index, 1);


    if (index >= 0) {
      setIndexText(index);
      setTitle(questions[index].title);
      setTypeOfQuestion(questions[index].response);
      setOptions(questions[index].options);
      setCorrectOption(questions[index].correct_option);
      setQuestionId(questions[index].id);
    }
    if (index === 0) {
      setPreviousQuestionFlag(true);
    }
  }

  function submitAnswer() {
    setPreviousQuestionFlag(false);

    //console.log(selected_options);

    if (selected_options.length === 0) {
      Alert("You must submit an answer!", 'warning');
    } else {
      PostApi(api_server_url + '/answer/create', { id: getRandomInt(), selected: selected_options, UserCode: getCookie('code'), QuestionId: question_id });

      index = getCookie('index');
      index++;
      setCookieByHours('index', index, 1);

      if (correct_option == 1) { // yes/no question
        if (selected_options == '2' && role == 'parent') { // No => skip questions where true
          Alert('Completed!', 'success');
          index = getCookie('index');
          index = total;
          setCookieByHours('index', index, 1);
        }

        if (selected_options == '2' && role == 'child') { // No => skip questions where true
          index = getCookie('index');
          index++;
          setCookieByHours('index', index, 1);
          let tmp_correct_option = questions[index].correct_option;

          while (tmp_correct_option == "true") {
            index = getCookie('index');
            index++;
            setCookieByHours('index', index, 1);
            tmp_correct_option = questions[index].correct_option;
          }
        }
      }

      if (index < total) {
        setIndexText(index);
        setTitle(questions[index].title);
        setTypeOfQuestion(questions[index].response);
        setOptions(questions[index].options);
        setCorrectOption(questions[index].correct_option);
        setQuestionId(questions[index].id);
      }
      else {
        Alert('Completed!', 'success');
        setQuestionsAvailable(false);
        setPreviousQuestionFlag(true);
        setEditAnswersFlag(true);

        setCookieByHours('index', 0, 1);
        setCookieByHours('completed', true, 1);

        setTitle('');
        setTypeOfQuestion('');
        setOptions([]);
        setCorrectOption(0);
        setIndexText(0);
        setTotal(0);
      }
    }
  }

  return (
    <>
      {/* <div style={{ width: '100%', display: (editAnswersFlag) ? 'block' : 'none' }}>
        <CButton variant={'outline'} className={'float-end'} onClick={editAnswers}>Edit answers <CIcon icon={cilPencil} /></CButton>
      </div> */}

      <div style={{ display: loader ? 'none' : 'block' }}>

        <div style={{ width: '100%', display: (currentPhaseText === 'N/A') ? 'none' : 'block' }}>
          <CBadge color='success-gradient'>Phase {currentPhaseText} is running</CBadge> <CBadge color='danger-gradient'>Deadline at {currentDeadlineText}</CBadge>
          <hr />
        </div>



        <div style={{ display: (questionsAvailable) ? 'block' : 'none' }}>
          <Questions options={options} loader={loader} index={indexText} id={question_id} title={title} typeOfQuestion={typeOfQuestion} total={total} handleSelect={handleSelect} previousQuestion={previousQuestion} previousQuestionFlag={previousQuestionFlag} submitAnswer={submitAnswer} />
        </div>

        <div className='home-card' style={{ display: (!questionsAvailable) ? 'block' : 'none' }}>
          <HomeCard otherUsers={otherUsers} pendingPhaseText={pendingPhaseText} />
        </div >

      </div>
    </>
  )
}

export default Home
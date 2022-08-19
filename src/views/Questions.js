import React, { useEffect, useState } from 'react'
import { CQuestion } from './components/CQuestion';
import { CheckSession } from '../services/Auth'
import { api_server_url } from 'src/config/urls';
import { GetApi, PostApi } from '../services/Axios';
import { useNavigate } from 'react-router-dom';
import { Alert } from '../services/Alerts';
import { getCookie } from '../services/Cookies';
import { AppLoader } from 'src/components/app/AppLoader';
import { useSearchParams } from 'react-router-dom';

const Questions = (props) => {
  CheckSession();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const role = getCookie('role') === 'Child' ? 'child' : 'parent';
  const phase = searchParams.get('phase');

  const [loading, setLoading] = useState(false);

  const [id, setId] = useState(0);
  const [question, setQuestion] = useState([]);
  const [title, setTitle] = useState('');
  const [options, setOptions] = useState([]);

  const [index, setIndex] = useState(0);
  const [total, setTotal] = useState(0);

  let type = role;
  let selected_options = [];

  useEffect(() => {
    setLoading(true);
    setIndex(0);

    Promise.resolve(
      GetApi(api_server_url + '/questions/' + type + '/' + phase)
        .then(function (value) {

          if (value.questions) {

            if (value.questions.length !== 0) {
              setQuestion(value.questions[index]);
              setId(value.questions[index].id);
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
          setLoading(false);
        })
    )
  }, []);

  const handleSelect = (e) => {
    if (e.target.checked) {
      selected_options.push(e.target.value);
    } else {
      const result = selected_options.filter(element => element !== e.target.value);
      selected_options = result;
    }
    console.log(selected_options);
  }

  function submitAnswer() {
    PostApi(api_server_url + '/answer/create', { selected: selected_options, UserCode: getCookie('code'), QuestionId: id });

    if (index < total) {
      Promise.resolve(
        GetApi(api_server_url + '/questions/' + type + '/' + phase)
          .then(function (value) {
            if (value) {
              setTitle(value.questions[index].title);
              setOptions(value.questions[index].options);
              setId(value.questions[index].id);
              setIndex(index + 1);
              setTotal(value.count);
            }
          })
      )
    } else {
      Alert('Completed!', 'success');

      setTitle('');
      setOptions([]);
      setIndex(0);
      setTotal(0);

      navigate('/');
    }
  }

  return (
    <>
      <div className='questions-center'>
        <div style={loading ? { display: 'none' } : { display: 'block' }} className='questions-card' >
          <CQuestion data={question} phase={phase} title={title} index={index} total={total} options={options} submitAnswer={submitAnswer} handleSelect={handleSelect} />
        </div>

        <div style={loading ? { display: 'block' } : { display: 'none' }}  >
          <AppLoader />
        </div>
      </div>
    </>
  )
}

export default Questions

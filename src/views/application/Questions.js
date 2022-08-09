import React, { useEffect, useState } from 'react'
import { CQuestion } from './components/CQuestion';
import { CheckSession } from './functions/general'
import { api_server_url } from 'src/config/urls';
import { GetApi, PostApi } from './functions/axios';
import { CLoader } from './components/CLoader';
import { useNavigate } from 'react-router-dom';
import { Alert } from './components/Alerts';
import { getCookie } from './functions/cookies';

const Questions = () => {
  CheckSession();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [id, setId] = useState(0);
  const [title, setTitle] = useState('');
  const [options, setOptions] = useState([]);


  const [index, setIndex] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setLoading(true);
    setIndex(0);

    Promise.resolve(
      GetApi(api_server_url + '/questions')
        .then(function (value) {
          if (value) {
            setId(value.questions[index].id);
            setTitle(value.questions[index].title);
            setOptions(value.questions[index].options);
            setIndex(index + 1);
            setTotal(value.count);
          }
          setLoading(false);
        })
    )
  }, []);

  function submitAnswer(option) {
    PostApi(api_server_url + '/answer/create', { selected: option, UserCode: getCookie('code'), QuestionId: id });

    if (index < total) {
      Promise.resolve(
        GetApi(api_server_url + '/questions')
          .then(function (value) {
            if (value) {
              setTitle(value.questions[index].title);
              setOptions(value.questions[index].options);
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
      <div className='center'>
        <div style={loading ? { display: 'none' } : { display: 'block' }}  >
          <CQuestion title={title} index={index} total={total} options={options} submitAnswer={submitAnswer} />
        </div>

        <div style={loading ? { display: 'block' } : { display: 'none' }}  >
          <CLoader />
        </div>
      </div>
    </>
  )
}

export default Questions

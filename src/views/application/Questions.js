import React, { useEffect, useState } from 'react'
import { CQuestion } from './components/CQuestion';
import { CheckSession } from './functions/general'
import { api_server_url } from 'src/config/urls';
import { GetApi } from './functions/axios';
import { CLoadingPages } from './components/CLoadingPages';

const Questions = () => {
  CheckSession();

  const [loading, setLoading] = useState(false);

  const [questionsData, setQuestionsData] = useState([]);
  const [question, setQuestion] = useState({});
  const [title, setTitle] = useState('');
  const [options, setOptions] = useState([]);
  const [index, setIndex] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setLoading(true);
    Promise.resolve(
      GetApi(api_server_url + '/questions')
        .then(function (value) {
          if (value) {
            setQuestionsData(value.questions);
            setQuestion(value.questions[index]);
            setTitle(value.questions[index].title);
            setOptions(value.questions[index].options);
            setOptions(value.questions[index].options);
            setIndex(1);
            setTotal(value.count);
          }
          setLoading(false);
        })
    )
  }, []);

  return (
    <>
      <div style={loading ? { display: 'none' } : { display: 'block' }}  >
        <CQuestion title={title} index={index} total={total} options={options} />
      </div>
      <div style={loading ? { display: 'block' } : { display: 'none' }}  >
        <CLoadingPages />
      </div>
    </>
  )
}

export default Questions


import { CSidebar } from '@coreui/react-pro';
import React, { useEffect, useState } from 'react'
import { AppSidebar } from 'src/components';
import { api_server_url } from 'src/config/urls';
import { GetApi } from '../functions/axios';
import CPushServerForm from './CPushServerForm';
import { CTable } from './CTable';


const Admin = () => {
  const [loading, setLoading] = useState(false);

  const [sessions_data, setSessionsData] = useState([]);
  const [users_data, setUsersData] = useState([]);
  const [roles_data, setRolesData] = useState([]);
  const [questions_data, setQuestionsData] = useState([]);

  useEffect(() => {
    setLoading(true);
    Promise.resolve(
      GetApi(api_server_url + '/sessions')
        .then(function (value) {
          setSessionsData(value);
          setLoading(false);
        }),
      GetApi(api_server_url + '/users')
        .then(function (value) {
          setUsersData(value);
          setLoading(false);
        }),
      GetApi(api_server_url + '/roles')
        .then(function (value) {
          setRolesData(value);
          setLoading(false);
        }),
      GetApi(api_server_url + '/questions')
        .then(function (value) {
          setQuestionsData(value.questions);
          setLoading(false);
        }),
    );
    setLoading(true);
  }, []);

  const resetData = () => {
    setLoading(true);
    Promise.resolve(
      GetApi(api_server_url + '/sessions')
        .then(function (value) {
          setSessionsData(value);
          setLoading(false);
        }),
      GetApi(api_server_url + '/users')
        .then(function (value) {
          setUsersData(value);
          setLoading(false);
        }),
      GetApi(api_server_url + '/roles')
        .then(function (value) {
          setRolesData(value);
          setLoading(false);
        }),
      GetApi(api_server_url + '/questions')
        .then(function (value) {
          setQuestionsData(value.questions);
          setLoading(false);
        }),
    );
  }

  const postQuestion = () => {
  }

  const sessions_columns = [
    { key: 'id', label: 'ID', _style: { width: '10%' }, _props: { color: 'success' } },
    { key: 'code', label: 'User Code', _style: { width: '20%' }, _props: { color: 'success' } },
    { key: 'activated', _style: { width: '10%' }, _props: { color: 'success' } },
    { key: 'start_date', _style: { width: '20%' }, _props: { color: 'success' } },
    { key: 'end_date', _style: { width: '20%' }, _props: { color: 'success' } },
    { key: 'status', _style: { width: '20%' }, _props: { color: 'success' } },
  ]

  const users_columns = [
    { key: 'code', label: 'Code', _style: { width: '50%' }, _props: { color: 'danger' } },
    { key: 'RoleId', _style: { width: '50%' }, _props: { color: 'danger' } },
  ]

  const roles_columns = [
    { key: 'id', label: 'ID', _style: { width: '50%' }, _props: { color: 'primary' } },
    { key: 'title', _style: { width: '50%' }, _props: { color: 'primary' } },
  ]

  const questions_columns = [
    { key: 'id', label: 'ID', _style: { width: '10%' }, _props: { color: 'warning' } },
    { key: 'title', _style: { width: '20%' }, _props: { color: 'warning' } },
    { key: 'options', _style: { width: '50%' }, _props: { color: 'warning' } },
    { key: 'correct_option', _style: { width: '20%' }, _props: { color: 'warning' } },
  ]


  return (
    <>
      <AppSidebar />
      <CPushServerForm />
      <CTable table_title='Sessions' data={sessions_data} columns={sessions_columns} loading={loading} />
      <CTable table_title='Users' data={users_data} columns={users_columns} loading={loading} delete_all_url={'/users/delete-all'} resetData={resetData} />
      <CTable table_title='Roles' data={roles_data} columns={roles_columns} loading={loading} />
      <CTable table_title='Questions' data={questions_data} columns={questions_columns} loading={loading} postQuestion={postQuestion} />
    </>

  )
}

export default Admin
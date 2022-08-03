
import React, { useEffect, useState } from 'react'
import { api_server_url } from 'src/config/urls';
import { GetApi } from '../functions/axios';
import CPushServerForm from './CPushServerForm';
import { CTable } from './CTable';


const Admin = () => {
  const [loading, setLoading] = useState(false);

  const [sessions_data, setSessionsData] = useState([]);
  const [users_data, setUsersData] = useState([]);
  const [roles_data, setRolesData] = useState([]);

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
    );
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
    );
  }

  const users_columns = [
    { key: 'code', label: 'ID', _style: { width: '50%' }, _props: { color: 'danger' } },
    { key: 'RoleId', _style: { width: '50%' }, _props: { color: 'danger' } },
  ]

  const sessions_columns = [
    { key: 'id', label: 'ID', _style: { width: '10%' }, _props: { color: 'success' } },
    { key: 'code', _style: { width: '20%' }, _props: { color: 'success' } },
    { key: 'activated', _style: { width: '10%' }, _props: { color: 'success' } },
    { key: 'start_date', _style: { width: '20%' }, _props: { color: 'success' } },
    { key: 'end_date', _style: { width: '20%' }, _props: { color: 'success' } },
    { key: 'status', _style: { width: '20%' }, _props: { color: 'success' } },
  ]

  const roles_columns = [
    { key: 'id', label: 'ID', _style: { width: '50%' }, _props: { color: 'primary' } },
    { key: 'title', _style: { width: '50%' }, _props: { color: 'primary' } },
  ]


  return (
    <>
      <CPushServerForm />
      <CTable table_title='Users' data={users_data} columns={users_columns} loading={loading} delete_all_url={'/users/delete-all'} resetData={resetData} />
      <CTable table_title='Sessions' data={sessions_data} columns={sessions_columns} loading={loading} />
      <CTable table_title='Roles' data={roles_data} columns={roles_columns} loading={loading} />
    </>

  )
}

export default Admin
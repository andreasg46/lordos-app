import React, { useEffect, useState } from 'react'
import {
  CCard,
  CButton,
  CCardHeader,
  CCardBody,
  CCardFooter,
  CSmartTable,
  CCol,
  CRow,
  CForm, CFormLabel, CFormSelect, CFormInput, CFormTextarea
} from '@coreui/react-pro'
import CIcon from '@coreui/icons-react';
import { cilSend } from '@coreui/icons';
import { today, currentTime } from '../helpers';
import { GetDevices, SendPushBySession } from './OneSignalServer';

const devices_columns = [
  { key: 'id', label: 'Player ID', _props: { color: 'info' } },
  { key: 'code', _props: { color: 'info' } },
  { key: 'session_id', _props: { color: 'info' } },
  { key: 'device_model', _props: { color: 'info' } },
  { key: 'device_type', _props: { color: 'info' } },
  { key: 'language', _props: { color: 'info' } },
  { key: 'invalid_identifier', label: 'Subscribed', _props: { color: 'info' } },
];

const CPushServerForm = () => {
  const [devicesData, setDevicesData] = useState([]);

  const [selectedSession, setSelectedSession] = useState('');
  const [headings, setHeadings] = useState('Knock Knock!');
  const [subtitle, setSubtitle] = useState('Questions are now available!');
  const [campaign, setCampaign] = useState('Default Campaign');
  const [topic, setTopic] = useState('Default Topic');
  const [frequency, setFrequency] = useState('');
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [deliveryTime, setDeliveryTime] = useState(currentTime);
  const [clickUrl, setClickUrl] = useState('http://localhost:5000/questions');


  useEffect(() => {
    Promise.resolve(
      GetDevices()
        .then(function (value) {
          setDevicesData(value.players);
        }),
    );
  }, []);


  const handleSubmit = (e) => {
    e.preventDefault();

    SendPushBySession(selectedSession, headings, subtitle, campaign, new Date(startDate + ', ' + deliveryTime), topic, clickUrl)
  }

  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CForm onSubmit={handleSubmit}>
            <CCard className="mb-4">
              <CCardHeader>
                <strong>Send Push notifications</strong> <small>Devices Table</small>
              </CCardHeader>
              <CCardBody>
                <CRow className="g-3">
                  <CSmartTable
                    sorterValue={{ column: 'id', state: 'asc' }}
                    tableProps={{ striped: true, responsive: true }}
                    items={devicesData}
                    columns={devices_columns}
                    columnSorter
                    itemsPerPage={50}
                    pagination
                    scopedColumns={{
                      session_id: (item) => (
                        <td>
                          {item.tags.session_id}
                        </td>
                      ),
                      code: (item) => (
                        <td>
                          {item.tags.code}
                        </td>
                      ),
                    }}
                  />
                  <CCol md={2}>
                    <CFormLabel htmlFor="inputState">Session ID</CFormLabel>
                    <CFormInput placeholder="Session ID" aria-label="Selected Session"
                      onChange={(e) => setSelectedSession(e.target.value)} />
                  </CCol>
                  <CCol md={2}>
                    <CFormLabel htmlFor="inputState">Campaign Name</CFormLabel>
                    <CFormInput placeholder="My Campaign" aria-label="Campaign" value={campaign}
                      onChange={(e) => setCampaign(e.target.value)} />
                  </CCol>
                  <CCol md={2}>
                    <CFormLabel htmlFor="inputState">Topic</CFormLabel>
                    <CFormInput placeholder="My Topic" aria-label="Topic" value={topic}
                      onChange={(e) => setTopic(e.target.value)} />
                  </CCol>
                  <CCol md={2}>
                    <CFormLabel htmlFor="inputState">Heading</CFormLabel>
                    <CFormInput placeholder="My Heading" aria-label="Heading" value={headings}
                      onChange={(e) => setHeadings(e.target.value)} />
                  </CCol>

                  <CCol md={4}>
                    <CFormLabel htmlFor="inputState">Subtitle</CFormLabel>
                    <CFormInput placeholder="My Subtitle" aria-label="Subtitle" value={subtitle}
                      onChange={(e) => setSubtitle(e.target.value)} />
                  </CCol>
                  <CCol md={2}>
                    <CFormLabel htmlFor="inputState">Frequency</CFormLabel>
                    <CFormSelect id="inputState" defaultValue={'Once per day'}
                      onChange={(e) => setFrequency(e.target.value)}>
                      <option>Once per day</option>
                      <option>Once per week</option>
                      <option>Once per month</option>
                    </CFormSelect>
                  </CCol>
                  <CCol md={2}>
                    <CFormLabel htmlFor="inputState">Start Date</CFormLabel>
                    <CFormInput type={'date'} defaultValue={today} onChange={(e) => setStartDate(e.target.value)}
                      aria-label="Date" />
                  </CCol>
                  <CCol md={2}>
                    <CFormLabel htmlFor="inputState">End Date</CFormLabel>
                    <CFormInput type={'date'} defaultValue={today} onChange={(e) => setEndDate(e.target.value)}
                      aria-label="Date" />
                  </CCol>
                  <CCol md={2}>
                    <CFormLabel htmlFor="inputState">Delivery Time</CFormLabel>
                    <CFormInput type={'time'} defaultValue={currentTime}
                      onChange={(e) => setDeliveryTime(e.target.value)}
                      aria-label="Time" />
                  </CCol>
                  <CCol md={4}>
                    <CFormLabel htmlFor="inputState">Click URL</CFormLabel>
                    <CFormInput placeholder="http://localhost:5000/questions" aria-label="URL" value={clickUrl}
                      onChange={(e) => setClickUrl(e.target.value)} />
                  </CCol>
                </CRow>
              </CCardBody>
              <CCardFooter style={{ textAlign: 'end' }}>
                <CButton type={"submit"} size='sm'>Send Push <CIcon icon={cilSend} /></CButton>
              </CCardFooter>
            </CCard>
          </CForm>
        </CCol>
      </CRow>
    </>
  )
}

export default CPushServerForm

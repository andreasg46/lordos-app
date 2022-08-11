import axios from "axios";
import { api_server_url } from "src/config/urls";
import { GetApi, PostApi } from "./Axios";

export async function SendPushBySession(session_id, headings, subtitle, campaign, datetime, topic, click_url) {
  console.log("Sending Web Push...");
  let body = {
    session_id: session_id,
    headings: headings,
    subtitle: subtitle,
    campaign: campaign,
    datetime: datetime,
    topic: topic,
    click_url: click_url
  }
  await PostApi(api_server_url + '/web-push', body)
    .then(function (value) {
      console.log(value);
    });
}

export async function SendSMSBySession(session_id, subtitle, datetime, click_url) {
  console.log("Sending SMS Push...");
  let body = {
    session_id: session_id,
    subtitle: subtitle,
    datetime: datetime,
    click_url: click_url
  }
  await PostApi(api_server_url + '/sms-push', body)
    .then(function (value) {
      console.log(value);
    });
}

export async function GetDevices() {
  let data = '';
  await GetApi(api_server_url + '/devices')
    .then(function (value) {
      data = value.body.players;
    });
  return data;
}

export async function AddTags(userId, session_id, code) {
  const options = {
    method: 'PUT',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      app_id: `${process.env.REACT_APP_ONE_SIGNAL_APP_ID}`,
      tags: {
        session_id: session_id,
        code: code
      }
    })
  };

  fetch('https://onesignal.com/api/v1/players/' + userId, options)
    .then(response => response.json())
    .then(response => console.log(response))
    .catch(err => console.error(err));
}

export async function AddTagsWithExternalUserId(userId, session_id, code) {
  const options = {
    method: 'PUT',
    headers: { Accept: 'text/plain', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      app_id: `${process.env.REACT_APP_ONE_SIGNAL_APP_ID}`,
      tags: {
        session_id: session_id,
        code: code
      }
    })
  };

  fetch('https://onesignal.com/api/v1/apps/'.concat(`${process.env.REACT_APP_ONE_SIGNAL_APP_ID}`).concat('/users/').concat(userId), options)
    .then(response => response.json())
    .then(response => console.log(response))
    .catch(err => console.error(err));
}

